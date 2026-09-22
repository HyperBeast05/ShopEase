import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  let connection;

  try {
    const userId = req.user.id;

    //Get one connection from the pool
    connection = await pool.getConnection();

    //start transaction
    await connection.beginTransaction();

    //1.Get the user's cart with current product information
    const [cartItems] = await connection.query(
      `
                SELECT
                    cart_items.id AS cart_item_id,
                    cart_items.product_id,
                    cart_items.quantity,

                    products.name,
                    products.price,
                    products.stock
                
                FROM cart_items
                JOIN products
                    ON cart_items.product_id = products.id
                WHERE cart_items.user_id = ?
            `,
      [userId],
    );

    //2. check whether cart is empty
    if (cartItems.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    //3. check stock and calculate total amount
    let totalAmount = 0;

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: `${item.name} does not have enough stock`,
        });
      }
      totalAmount += Number(item.price) * item.quantity;
    }

    //4.create the order
    const [orderResult] = await connection.query(
      `
                INSERT INTO orders (user_id,total_amount) VALUES (?,?)
            `,
      [userId, totalAmount],
    );

    const orderId = orderResult.insertId;

    //5.create order items
    for (const item of cartItems) {
      await connection.query(
        `
                    INSERT INTO order_items(order_id,product_id,quantity,price)
                    VALUES (?,?,?,?)
                `,
        [orderId, item.product_id, item.quantity, item.price],
      );
    }

    //6.Reduce product stock
    for (const item of cartItems) {
      const [stockResult] = await connection.query(
        `
                    UPDATE products
                    SET stock = stock - ?
                    WHERE id = ?
                    AND stock >= ?
                `,
        [item.quantity, item.product_id, item.quantity],
      );

      if (stockResult.affectedRows === 0) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: `${item.name} does not have enough stock`,
        });
      }
    }

    //7.clear user's cart
    await connection.query(
      `
         DELETE FROM cart_items WHERE user_id = ?
       `,
      [userId],
    );

    //8.Save everything permanently
    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order_id: orderId,
        total_amount: totalAmount,
      },
    });
  } catch (error) {
    //If something fails, undo everything
    if (connection) {
      await connection.rollback();
    }

    console.error("Error creating order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  } finally {
    // Return connection to the pool
    if (connection) {
      connection.release();
    }
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
            SELECT
                orders.id AS order_id,
                orders.total_amount,
                orders.status,
                orders.created_at,

                order_items.id AS order_item_id,
                order_items.product_id,
                order_items.quantity,
                order_items.price,

                products.name,
                products.image

            FROM orders

            JOIN order_items
                ON orders.id = order_items.order_id

            JOIN products
                ON order_items.product_id = products.id

            WHERE orders.user_id = ?
            ORDER BY orders.created_at DESC
            `,
      [userId],
    );

    const ordersMap = {};

    for (const row of rows) {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          total_amount: row.total_amount,
          status: row.status,
          created_at: row.created_at,
          items: [],
        };
      }

      ordersMap[row.order_id].items.push({
        order_items_id: row.order_item_id,
        product_id: row.product_id,
        name: row.name,
        image_url: row.image,
        quantity: row.quantity,
        price: row.price,
      });
    }

    const orders = Object.values(ordersMap);

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;

    const orderId = req.params.id;

    //1.Get the order and verify that it belongs to the logged-in user
    const [orders] = await pool.query(
      `
            SELECT id,total_amount,status,created_at
            FROM orders
            WHERE id = ? AND user_id = ?
            `,
      [orderId, userId],
    );

    //2.Check whether the order exists and belongs to this user
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    //3.Get all items belonging to this order
    const [items] = await pool.query(
      `
            SELECT
                order_items.id AS order_item_id,
                order_items.product_id,
                order_items.quantity,
                order_items.price,

                products.name,
                products.image

            FROM order_items

            JOIN products
                ON  order_items.product_id = products.id
            
            WHERE order_items.order_id = ?
            `,
      [orderId],
    );

    //4.Send order with its items
    res.status(200).json({
      success: true,
      data: {
        order_id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items,
      },
    });
  } catch (error) {
    console.error("Error getting order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get order",
    });
  }
};

export const getAdminOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    //1.Get order and customer information
    const [orders] = await pool.query(
      `
      SELECT
        orders.id AS order_id,
        orders.total_amount,
        orders.status,
        orders.created_at,

        users.id AS user_id,
        users.name AS customer_name,
        users.email AS customer_email

      FROM orders

      JOIN users
        ON orders.user_id = users.id
      WHERE orders.id = ?
      `,
      [orderId],
    );

    // 2.Check Whether the order exists
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const order = orders[0];

    //3. Get all items belonging to this order
    const [items] = await pool.query(
      `
      SELECT
        order_items.id AS order_item_id,
        order_items.product_id,
        order_items.quantity,
        order_items.price,

        products.name,
        products.image
      
      FROM order_items
      JOIN products
        ON order_items.product_id = products.id

      WHERE order_items.order_id = ?
      `,
      [orderId],
    );

    //4.Send complete order details
    res.status(200).json({
      success: true,
      data: {
        order_id: order.order_id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,

        customer: {
          user_id: order.user_id,
          name: order.customer_name,
          email: order.customer_email,
        },
        items,
      },
    });
  } catch (error) {
    console.error("Error getting admin order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get order",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  let connection;
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    //1.Get current order status
    const [orders] = await connection.query(
      `
      SELECT id, status 
      FROM orders 
      WHERE id = ?
      FOR UPDATE
      `,
      [orderId],
    );

    if (orders.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = orders[0].status;

    const allowedTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[currentStatus].includes(status)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${currentStatus} to ${status}`,
      });
    }

    //2.If cancelling, restore product stock
    if (status === "cancelled") {
      const [orderItems] = await connection.query(
        `
        SELECT product_id,quantity
        FROM order_items
        WHERE order_id = ?
        `,
        [orderId],
      );

      for (const item of orderItems) {
        await connection.query(
          `
          UPDATE products
          SET stock = stock + ?
          WHERE id = ?
          `,
          [item.quantity, item.product_id],
        );
      }
    }

    //3.Update order status
    await connection.query(
      `
      UPDATE orders SET status = ? WHERE id = ?
      `,
      [status, orderId],
    );

    //4.Get updated order
    const [updatedOrders] = await connection.query(
      `
      SELECT id, total_amount, status, created_at
      FROM orders
      WHERE id = ?
      `,
      [orderId],
    );
    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrders[0],
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating order status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const cancelOrder = async (req, res) => {
  let connection;

  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    //Get one Connection
    connection = await pool.getConnection();

    //start Transaction
    await connection.beginTransaction();

    //1. Find the order and verify ownership
    const [orders] = await connection.query(
      `
      SELECT id, status
      FROM orders
      WHERE id = ? AND user_id = ?
      FOR UPDATE
      `,
      [orderId, userId],
    );

    //order does not exist or belongs to another user
    if (orders.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    //2.check whether order can be cancelled
    if (order.status !== "pending") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because its status is ${order.status}`,
      });
    }

    //3.Get all items in the order
    const [orderItems] = await connection.query(
      `
      SELECT product_id,quantity
      FROM  order_items
      WHERE order_id = ?
      `,
      [orderId],
    );

    //4. Restore product stock
    for (const item of orderItems) {
      await connection.query(
        `
          UPDATE products
          SET stock = stock+?
          WHERE id = ?
          `,
        [item.quantity, item.product_id],
      );
    }

    //5.Change order status
    await connection.query(
      `UPDATE orders SET status = "cancelled" WHERE id = ?`,
      [orderId],
    );

    //6. Save all changes
    await connection.commit();
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    // Undo everything if something fails
    if (connection) {
      await connection.rollback();
    }

    console.error("Error cancelling order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  } finally {
    //return connection to pool
    if (connection) {
      connection.release();
    }
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
        SELECT
          orders.id AS order_id,
          orders.total_amount,
          orders.status,
          orders.created_at,

          users.id AS user_id,
          users.name AS customer_name,
          users.email AS customer_email

        FROM orders
        JOIN users
          ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
      `,
    );

    res.status(200).json({
      success: true,
      totalOrders: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error getting all orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};
