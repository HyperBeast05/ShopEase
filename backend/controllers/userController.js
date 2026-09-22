import pool from "../config/db.js";

export const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await pool.query(
      `
      SELECT 
        users.id,
        users.name,
        users.email,
        users.created_at,

        COUNT(orders.id) AS total_orders,
        COALESCE(
          SUM(
            CASE 
              WHEN orders.status !='cancelled'
              THEN orders.total_amount
              ELSE 0
            END
          ),0) AS total_spent

      FROM users
      LEFT JOIN orders
        ON users.id = orders.user_id

      WHERE users.role = "user"

      GROUP BY
        users.id,
        users.name,
        users.email,
        users.created_at
      
      ORDER BY users.created_at DESC
      `,
    );

    res.status(200).json({
      success: true,
      totalCustomers: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Error getting customers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get customers",
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;

    const [customer] = await pool.query(
      `
            SELECT id, name, email, created_at
            FROM users
            WHERE id = ?
                AND role = "user"
            `,
      [customerId],
    );

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const [orders] = await pool.query(
      `
        SELECT 
            id AS order_id,
            total_amount,
            status,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESc
        `,
      [customerId],
    );

    res.status(200).json({
      success: true,
      data: { ...customer[0], orders },
    });
  } catch (error) {
    console.error("Error getting customer:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get customer",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    //Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const trimmedName = name.trim();

    //Optional reasonable length validation
    if (trimmedName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters",
      });
    }

    if (trimmedName.length > 100) {
      return res.status(400).json({
        message: "Name must not exceed 100 characters",
      });
    }

    //Update user's name
    const [result] = await pool.query(
      `
      UPDATE users SET name = ? WHERE id = ?
      `,
      [trimmedName, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get updated user
    const [users] = await pool.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId],
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: users[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
