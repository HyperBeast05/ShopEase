import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generatePasswordResetToken } from "../utils/passwordReset.js";
import { sendEmail } from "../utils/email.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (normalizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must not exceed 100 characters",
      });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be atleast 6 characters with one uppercase letter and one special character",
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name,email,password) VALUES (?,?,?)`,
      [normalizedName, normalizedEmail, hashedPassword],
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: result.insertId,
        name: normalizedName,
        email: normalizedEmail,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      normalizedEmail,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const [users] = await pool.query(
      "SELECT id, name, email FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );

    /*We return the same response whether the email exists or not.
    This prevents someone from discovering which email addresses
    have ShopEase accounts.*/

    if (users.length === 0) {
      return res.status(200).json({
        message:
          "If an account exists with the email, a password reset has been sent.",
      });
    }

    const user = users[0];

    const { resetToken, tokenHash } = generatePasswordResetToken();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
          AND used_at IS NULL
      `,
      [user.id],
    );

    await pool.query(
      `
      INSERT INTO password_reset_tokens
      (user_id, token_hash, expires_at)
      VALUES (?,?,?)
      `,
      [user.id, tokenHash, expiresAt],
    );

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset you ShopEase password",
      text: `Hello ${user.name},
      
      We received a request to reset your ShopEase password.
      Use the following link to reset yur password:
      ${resetURL}

      This link will expire in 15 minutes.

      If you did not request a password reset, you can safely ignore this email.

      ShopEase`,

      html: `
              <h2>Reset Your ShopEase password</h2>

              <p>Hello ${user.name},</p>

              <p>
                We received a request to reset your ShopEase password.
              </p>

              <p>
                <a href="${resetURL}">
                  Reset Password
                </a>
              </p>

              <p>
                This link will expire in <strong>15 minutes</strong>.
              </p>

              <p>
                If you did not request a password reset,
                you can safely ignore this email.
              </p>

              <p>ShopEase</p>
            `,
    });

    return res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to process password reset request",
    });
  }
};

export const resetPassword = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be atleast 6 characters with one uppercase letter and one special character.",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await connection.beginTransaction();

    const [resetTokens] = await connection.query(
      `
      SELECT id, user_id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token_hash = ?
      LIMIT 1
      FOR UPDATE
      `,
      [tokenHash],
    );

    if (resetTokens.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        message: "Invalid or expired password reset link",
      });
    }

    const resetToken = resetTokens[0];

    if (resetToken.used_at !== null) {
      await connection.rollback();

      return res.status(400).json({
        message: "This password reset link has already been used",
      });
    }

    if (new Date(resetToken.expires_at) <= new Date()) {
      await connection.rollback();

      return res.status(400).json({
        message: "This password reset link has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
      `
      UPDATE users
      SET password = ?
      WHERE id = ?
      `,
      [hashedPassword, resetToken.user_id],
    );

    await connection.query(
      `
      UPDATE password_reset_tokens
      SET used_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [resetToken.id],
    );

    await connection.commit();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
    });
  } finally {
    connection.release();
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    //1. Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    //2. Validate new password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters with one uppercase letter and on special character",
      });
    }

    //3. Get the user's current password
    const [users] = await pool.query(
      `
      SELECT id, password
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    //4. Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    //5. Prevent using the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from your current password",
      });
    }

    //6. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //7. Update password
    await pool.query(
      `
      UPDATE users SET password = ? WHERE id = ?
      `,
      [hashedPassword, userId],
    );

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};
