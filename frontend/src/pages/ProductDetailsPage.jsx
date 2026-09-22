import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Toast from "../components/Toast";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCartShopping,
  FaIndianRupeeSign,
  FaMinus,
  FaPlus,
} from "react-icons/fa6";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function ProductDetailsPage() {
  const { addToCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.data);
        setQuantity(1);
      } catch (error) {
        console.error("Error fetching product:", error);

        setProduct(null);
        setError(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  //Increase Quantity
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((quantity) => quantity + 1);
    }
  };

  //Decrease Quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to add products to your cart.",
        type: "error",
      });
      setTimeout(() => {
        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });
      }, 2000);
      return;
    }
    try {
      setAddingToCart(true);

      await addToCart(product.id, quantity);

      setToast({
        message: "Product added to cart!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);

      setToast({
        message:
          error.response?.data?.message || "Failed to add product to cart",
        type: "error",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3 text-muted">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Product not found</h2>

        <p className="text-muted mb-4">{error}</p>

        <Link
          to="/products"
          className="btn btn-dark d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Product not found</h2>

        <Link
          to="/products"
          className="btn btn-dark d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Back Button */}
      <Link
        to="/products"
        className="btn btn-outline-secondary mb-4 d-inline-flex align-items-center gap-2"
      >
        <FaArrowLeft />
        Back to Products
      </Link>

      <div className="row g-5">
        {/* Product Image */}
        <div className="col-lg-6">
          <div className="product-details-image-container shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="product-details-image"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="col-lg-6">
          <div className="product-details-content">
            <h1 className="fw-bold mb-3">{product.name}</h1>
            <p className="text-muted fs-5 mb-4">{product.description}</p>

            {/* Price */}
            <div className="mb-4">
              <span className="text-muted">Price</span>
            </div>

            <h2 className="text-primary fw-bold mt-1">
              <FaIndianRupeeSign className="me-1" />
              {Number(product.price).toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <span
              className={`badge fs-6 ${product.stock > 0 ? "text-bg-success" : "text-bg-danger"}`}
            >
              <FaBoxOpen className="me-2" />

              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-4">
              <label className="form-label fw-semibold me-2">Quantity</label>

              <div className="quantity-selector">
                <button
                  className="btn btn-outline-secondary"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  <FaMinus />
                </button>

                <span className="quantity-value">{quantity}</span>

                <button
                  className="btn btn-outline-secondary"
                  onClick={increaseQuantity}
                  disabled={quantity === product.stock}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}

          <button
            onClick={handleAddToCart}
            className="btn btn-dark btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={product.stock === 0 || addingToCart}
          >
            {addingToCart ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding...
              </>
            ) : (
              <>
                <FaCartShopping />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
export default ProductDetailsPage;
