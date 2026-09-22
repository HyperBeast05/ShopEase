import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";

function AdminAddProductPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category_id: "",
  });

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setError("");

        const response = await api.get("/categories");

        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);

        setError(error.response?.data?.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentdata) => ({
      ...currentdata,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.post("/products", {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image,
        category_id: Number(formData.category_id),
      });

      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);

      setError(error.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin/products" className="text-decoration-none">
          <FaArrowLeft className="me-2" />
          Back to products
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold mb-1">Add Product</h2>

                <p className="text-muted mb-0">
                  Add a new product to your store.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  {/* Price */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label fw-semibold">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-control"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="stock" className="form-label fw-semibold">
                      Stock
                    </label>

                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      className="form-control"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Image */}
                <div className="mb-3">
                  <label htmlFor="image" className="form-label fw-semibold">
                    Image URL
                  </label>

                  <input
                    type="url"
                    id="image"
                    name="image"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label
                    htmlFor="category_id"
                    className="form-label fw-semibold"
                  >
                    Category
                  </label>

                  <select
                    id="category_id"
                    name="category_id"
                    className="form-select"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    required
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : categories.length === 0
                          ? "No categories available"
                          : "Select a category"}
                    </option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Button */}
                <div className="d-flex gap-2">
                  <Link
                    to="/admin/products"
                    className="btn btn-outline-dark flex-grow-1"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={
                      saving || loadingCategories || categories.length === 0
                    }
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaFloppyDisk className="me-2" />
                        Save Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProductPage;
