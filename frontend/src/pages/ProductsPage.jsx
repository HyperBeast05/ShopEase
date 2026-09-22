import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-column justify-content-center align-items-start">
          <h1 className="fw-bold mb-1">Our Products</h1>
          <p className="text-muted mb-0">Explore our latest collection</p>
        </div>

        <span className="badge text-bg-dark fs-6 text-end">
          {products.length} products
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <h4>Failed to load products</h4>
          <p className="text-muted">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <h4>No products found</h4>
          <p className="text-muted">Please check back later</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ProductPage;
