import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaPen, FaPlus, FaTags, FaTrash } from "react-icons/fa6";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [updating, setUpdating] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/categories");

        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);

        setError(error.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await api.post("/categories", {
        name: categoryName.trim(),
      });

      setCategories((currentCategories) => [
        ...currentCategories,
        response.data.data,
      ]);
      setCategoryName("");
    } catch (error) {
      console.error("Error creating category:", error);

      setError(error.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!editingCategoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await api.put(`/categories/${editingCategoryId}`, {
        name: editingCategoryName.trim(),
      });

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === editingCategoryId ? response.data.data : category,
        ),
      );

      setEditingCategoryId(null);
      setEditingCategoryName("");
    } catch (error) {
      console.error("Error updating category:", error);

      setError(error.response?.data?.message || "Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setError("");
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${category.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/categories/${category.id}`);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentcategory) => currentcategory.id !== category.id,
        ),
      );
    } catch (error) {
      console.error("Error deleting category:", error);

      setError(error.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Manage Categories</h2>

        <p className="text-muted mb-0">
          View and Manage your product categories.
        </p>

        <span className="badge bg-primary mt-2">
          Total Categories: {categories.length}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Add Category */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <FaTags className="text-primary me-2" />

            <h5 className="fw-bold mb-0">Add Category</h5>
          </div>

          <form onSubmit={handleCreateCategory}>
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label
                  htmlFor="categoryName"
                  className="form-label fw-semibold"
                >
                  Category Name
                </label>

                <input
                  type="text"
                  id="categoryName"
                  className="form-control"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={creating}
                />
              </div>

              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-2" />
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Categories</h5>

          {categories.length === 0 ? (
            <p className="text-muted mb-0">No categories found.</p>
          ) : (
            <div className="list-group">
              {categories.map((category) => (
                <div key={category.id} className="list-group-item">
                  {editingCategoryId === category.id ? (
                    <form onSubmit={handleUpdateCategory}>
                      <div className="row g-2 align-items-center">
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            value={editingCategoryName}
                            onChange={(e) =>
                              setEditingCategoryName(e.target.value)
                            }
                            disabled={updating}
                            autoFocus
                          />
                        </div>

                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={updating}
                          >
                            {updating ? "Saving..." : "Save"}
                          </button>
                        </div>

                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setEditingCategoryId(null);
                              setEditingCategoryName("");
                            }}
                            disabled={updating}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">{category.name}</span>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditCategory(category)}
                          disabled={deleting}
                        >
                          <FaPen className="me-1" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={deleting}
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategoriesPage;
