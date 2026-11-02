import pool from "../config/db.js";

//Validate category ID
const isValidCategoryId = (id) => {
  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
};

//Validate and normalize category Name
const getValidateCategoryName = (name) => {
  if (typeof name !== "string") {
    return {
      valid: false,
      message: "Category name is required",
    };
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return {
      valid: false,
      message: "Category name is required",
    };
  }

  if (normalizedName.length > 100) {
    return {
      valid: false,
      message: "Category name must not exceed 100 characters",
    };
  }

  return {
    valid: true,
    name: normalizedName,
  };
};

//Get all categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM categories ORDER BY id ASC",
    );

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

//Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidCategoryId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [categories] = await pool.query(
      `SELECT * FROM categories WHERE id = ?`,
      [id],
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    console.error("Error fetching category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

//Create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const validation = getValidateCategoryName(name);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const normalizedName = validation.name;

    const [result] = await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [normalizedName],
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: result.insertId,
        name: normalizedName,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

//Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!isValidCategoryId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const validation = getValidateCategoryName(name);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const normalizedName = validation.name;

    //Check if category exists
    const [categories] = await pool.query(
      "SELECT id FROM categories WHERE id = ?",
      [id],
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    //Update category
    await pool.query(`UPDATE categories SET name =? WHERE id = ?`, [
      normalizedName,
      id,
    ]);

    //Get updated category
    const [updatedCategories] = await pool.query(
      "SELECT id, name FROM categories WHERE id = ?",
      [id],
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategories[0],
    });
  } catch (error) {
    console.error("Error updating category:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

//Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidCategoryId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete category because products belong to it",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
