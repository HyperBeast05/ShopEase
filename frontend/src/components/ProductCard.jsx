import { Link } from "react-router-dom";
import { FaBoxOpen, FaEye, FaIndianRupeeSign } from "react-icons/fa6";

function ProductCard({ product }) {
  return (
    <div className="card h-100 product-card shadow-sm border-0">
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top product-image"
        />
      </div>

      {/* Product Details */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{product.name}</h5>

        <p className="card-text text-muted product-description">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold fs-5 text-primary">
              <FaIndianRupeeSign className="me-1" />
              {Number(product.price).toLocaleString("en-IN")}
            </span>

            <span
              className={`badge ${product.stock > 0 ? "text-bg-success" : "text-bg-danger"}`}
            >
              <FaBoxOpen className="me-1" />
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <FaEye />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
