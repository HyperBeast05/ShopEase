import pool from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const [products] = await pool.query(
      `SELECT id,name,stock FROM products WHERE id = ?`,
      [product_id],
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = products[0];

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    const [existingCartItems] = await pool.query(
      `SELECT id,quantity FROM cart_items
             WHERE user_id = ? AND product_id = ?
            `,
      [userId, product_id],
    );

    if (existingCartItems.length > 0) {
      const cartItem = existingCartItems[0];

      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Total cart quantity exceeds available stock",
        });
      }

      await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
        newQuantity,
        cartItem.id,
      ]);

      return res.status(200).json({
        success: true,
        message: "Cart quantity updated successfully",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO cart_items (user_id,product_id,quantity)
            VALUES (?,?,?)`,
      [userId, product_id, quantity],
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        id: result.insertId,
        user_id: userId,
        product_id,
        quantity,
      },
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [cartItems] = await pool.query(
      `SELECT
          cart_items.id AS cart_item_id,
          cart_items.quantity,

          products.id AS product_id,
          products.name,
          products.description,
          products.price,
          products.stock,
          products.image,

          (products.price * cart_items.quantity) AS subtotal
        FROM cart_items

        JOIN products
          ON cart_items.product_id = products.id
        
        WHERE cart_items.user_id = ?
      `,
      [userId],
    );

    const totalAmount = cartItems.reduce(
      (total, item) => total + Number(item.subtotal),
      0,
    );

    const totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      totalItems: cartItems.length,
      totalQuantity,
      totalAmount,
      data: cartItems,
    });
  } catch (error) {
    console.error("Error getting cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItemId = req.params.id;

    const { quantity } = req.body;

    //1.validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    //2.Find the cart item and verify ownership

    const [cartItems] = await pool.query(
      `SELECT
          cart_items.id,
          cart_items.user_id,
          cart_items.product_id,
          cart_items.quantity,
          products.stock

      FROM cart_items
      JOIN products
        ON cart_items.product_id = products.id

      WHERE cart_items.id = ?
      AND cart_items.user_id = ?
      `,
      [cartItemId, userId],
    );

    //3.Check whether cart items exists and belongs to user
    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const cartItem = cartItems[0];

    //4. Check stock
    if (quantity > cartItem.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    //5. Update quantity
    await pool.query(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [
      quantity,
      cartItemId,
    ]);

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItemId = req.params.id;

    //Delete only if the cart item belongs to the logged-in-user
    const [result] = await pool.query(
      `
      DELETE FROM cart_items
      WHERE id = ?
      AND user_id = ?      
      `,
      [cartItemId, userId],
    );

    // affectedRows tells us how many rows were deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing cart items:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await pool.query(
      `DELETE FROM cart_items WHERE user_id = ?`,
      [userId],
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      deletedItems: result.affectedRows,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
