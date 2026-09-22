import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
        SELECT 
            products.id,
            products.name,
            products.description,
            products.price,
            products.stock,
            products.image,
            categories.name as category
        FROM products
        JOIN categories
            ON products.category_id = categories.id;
        `);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProductId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const [products] = await pool.query(
      `
        SELECT 
            products.id,
            products.name,
            products.description,
            products.price,
            products.stock,
            products.image,
            products.category_id,
            categories.name AS category
        FROM products
        JOIN categories
            ON products.category_id = categories.id
        WHERE products.id = ?
      `,
      [id],
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, category_id } = req.body;

    const normalizedName = name?.trim();
    if (
      !normalizedName ||
      price === undefined ||
      stock === undefined ||
      !Number.isInteger(Number(category_id)) ||
      Number(category_id) <= 0 ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, valid price, valid stock and category are required",
      });
    }

    const [categories] = await pool.query(
      "SELECT id FROM categories WHERE id = ?",
      [category_id],
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const normalizedDescription = description?.trim() || null;
    const normalizedImage = image?.trim() || null;

    const [result] = await pool.query(
      `
        INSERT INTO products
        (name,description,price,stock,image,category_id)
        VALUES(?,?,?,?,?,?)
      `,
      [
        normalizedName,
        normalizedDescription,
        price,
        stock,
        normalizedImage,
        category_id,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        id: result.insertId,
        name: normalizedName,
        description: normalizedDescription,
        price,
        stock,
        image: normalizedImage,
        category_id,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { name, description, price, stock, image, category_id } = req.body;

    const normalizedName = name?.trim();

    if (
      !normalizedName ||
      price === undefined ||
      stock === undefined ||
      !Number.isInteger(Number(category_id)) ||
      Number(category_id) <= 0 ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, valid price, valid stock and category are required",
      });
    }

    const [products] = await pool.query(
      "SELECT id FROM products WHERE id = ?",
      [id],
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const [categories] = await pool.query(
      "SELECT id FROM categories WHERE id = ?",
      [category_id],
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const normalizedDescription = description?.trim() || null;
    const normalizedImage = image?.trim() || null;

    await pool.query(
      `
          UPDATE products
          SET
            name = ?,
            description = ?,
            price = ?,
            stock = ?,
            image = ?,
            category_id = ?
          WHERE id = ?
      `,
      [
        normalizedName,
        normalizedDescription,
        price,
        stock,
        normalizedImage,
        category_id,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message:
          "This product cannot be deleted because it has already been used in an order.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
