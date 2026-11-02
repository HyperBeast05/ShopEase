import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  //1/ Check whether the Authorization header exists
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  //2. Check JWT configuration
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      success: false,
      message: "Authorization service configuration error",
    });
  }

  //3. Verify JWT separately
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  //4. Check user and token version in database
  try {
    const [users] = await pool.query(
      "SELECT id, token_version FROM users WHERE id = ?",
      [decoded.id],
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (decoded.token_version !== users[0].token_version) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    //5. Attach authentication user information
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication database error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication service temporarily unavailable",
    });
  }
};

// Admin authorization middleware
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only",
    });
  }
  next();
};
