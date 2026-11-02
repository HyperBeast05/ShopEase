import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaIndianRupeeSign,
  FaPenToSquare,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/products/${productToDelete.id}`);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productToDelete.id),
      );

      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);

      setProductToDelete(null);

      setError(error.response?.data?.message || "Failed to delete Product");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Products</h2>

          <p className="text-muted mb-0">
            View and manage your store products.
          </p>

          <span className="badge bg-primary mt-2">
            Total Products: {products.length}
          </span>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-dark">
            <FaArrowLeft className="me-2" />
            Dashboard
          </Link>

          <Link to="/admin/products/new" className="btn btn-primary">
            <FaPlus className="me-2" />
            Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {/* Products */}
      {products.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaBoxOpen size={55} className="text-muted mb-3" />

            <h5 className="fw-bold">No Products Found</h5>
            <p className="text-muted mb-0">
              There are no products in your store.
            </p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="rounded"
                            style={{
                              width: "55px",
                              height: "55px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{
                              width: "55px",
                              height: "55px",
                            }}
                          >
                            <FaBoxOpen className="text-muted" />
                          </div>
                        )}

                        <div className="ms-3">
                          <div className="fw-semibold">{product.name}</div>

                          <small className="text-muted">ID: {product.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge bg-light text-dark border">
                        {product.category}
                      </span>
                    </td>

                    <td className="fw-semibold">
                      <FaIndianRupeeSign className="me-1" />
                      {Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={
                          product.stock === 0
                            ? "badge bg-danger"
                            : product.stock <= 5
                              ? "badge bg-warning text-dark"
                              : "badge bg-success"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="text-end">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaPenToSquare className="me-1" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-2"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteProductModal"
                        onClick={() => setProductToDelete(product)}
                      >
                        <FaTrash className="me-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal */}
      <div
        className="modal fade"
        id="deleteProductModal"
        tabIndex="-1"
        aria-labelledby="deleteProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteProductModalLabel">
                Delete Product
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <p className="mb-2">
                Are you sure you want to delete this product?
              </p>

              {productToDelete && (
                <div className="alert alert-warning mb-0">
                  <strong>{productToDelete.name}</strong>
                </div>
              )}

              <p className="text-muted small mt-3 mb-0">
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDeleteProduct}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="me-2" />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminProductsPage;
