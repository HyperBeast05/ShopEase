import { useEffect, useState } from "react";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function AdminEditProductPage() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoriesResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
        ]);

        const product = productResponse.data.data;
        const categoriesData = categoriesResponse.data.data;

        setCategories(categoriesData);

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          image: product.image || "",
          category_id: product.category_id ?? "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);

        setError(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSaveError("");

      await api.put(`/products/${id}`, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image,
        category_id: Number(formData.category_id),
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);

      setSaveError(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading Product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>

        <Link to="/admin/products" className="btn btn-outline-dark">
          <FaArrowLeft className="me-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin/products" className="text-decoration-none">
          <FaArrowLeft className="me-2" />
          Back to Products
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold mb-1">Edit Product</h2>

                <p className="text-muted mb-0">
                  Update your product information.
                </p>
              </div>

              {saveError && (
                <div className="alert alert-danger" role="alert">
                  {saveError}
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
                    rows="4"
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
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Button */}
                <div className="d-flex gap-2">
                  <Link to="/admin/products" className="btn btn-outline-dark">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={saving}
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
                        <FaFloppyDisk className="me-1" />
                        Save Changes
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
export default AdminEditProductPage;
