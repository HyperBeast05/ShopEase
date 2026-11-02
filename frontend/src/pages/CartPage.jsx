import { useContext, useState } from "react";
import {
  FaCartShopping,
  FaIndianRupeeSign,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import Toast from "../components/Toast";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const {
    cart,
    cartQuantity,
    cartTotal,
    loading,
    error,
    removeFromCart,
    updateQuantity,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      setUpdatingItemId(cartItemId);

      await updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      console.error("Error updating cart quantity:", error);

      setToast({
        message: error.response?.data?.message || "Failed to update quantity",
        type: "error",
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      setUpdatingItemId(cartItemId);
      await removeFromCart(cartItemId);

      setToast({
        message: "Product removed from cart!",
        type: "success",
      });
    } catch (error) {
      console.error("Error removing cart item:", error);

      setToast({
        message: error.response?.data?.message || "Failed to remove product",
        type: "error",
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-3">
        <h2>Loading Cart...</h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Your Cart</h1>
        <p className="text-muted mb-0">
          Review your selected products before checkout.
        </p>
      </div>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Cart Items</h4>

                <span className="badge text-bg-dark rounded-pill">
                  {cart.length} {cart.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              {cart.length === 0 ? (
                <div className="empty-cart text-center py-5">
                  <div className="empty-cart-icon mb-4">
                    <FaCartShopping />
                  </div>

                  <h4 className="fw-bold mb-2">Your Cart is Empty</h4>
                  <p className="text-muted mb-4">
                    You haven't added anything to your cart yet.
                  </p>

                  <Link to="/products" className="btn btn-dark px-4">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="cart-item border-bottom pb-4 mb-4"
                  >
                    <div className="row align-items-center g-3">
                      {/* Product Image */}
                      <div className="col-4 col-md-3">
                        <div className="cart-image-container">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-image"
                          />
                        </div>
                      </div>

                      {/* Product Information */}
                      <div className="col-8 col-md-5">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="fw-bold mb-2">{item.name}</h5>
                            <p className="text-muted mb-2">
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </p>
                            <span className="badge text-bg-success">
                              {item.stock} in stock
                            </span>
                          </div>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            title="Remove from cart"
                            disabled={updatingItemId === item.cart_item_id}
                            onClick={() =>
                              handleRemoveFromCart(item.cart_item_id)
                            }
                          >
                            {updatingItemId === item.cart_item_id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-6 col-md-2">
                        <small className="text-muted d-block mb-2">
                          Quantity
                        </small>

                        <div className="quantity-selector">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={
                              item.quantity <= 1 ||
                              updatingItemId === item.cart_item_id
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.cart_item_id,
                                item.quantity - 1,
                              )
                            }
                          >
                            <FaMinus />
                          </button>

                          <span className="fw-bold">
                            {updatingItemId === item.cart_item_id
                              ? "..."
                              : item.quantity}
                          </span>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={
                              item.quantity >= item.stock ||
                              updatingItemId === item.cart_item_id
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.cart_item_id,
                                item.quantity + 1,
                              )
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-6 col-md-2 text-md-end">
                        <small className="text-muted d-block mb-2">
                          Subtotal
                        </small>

                        <span className="fw-bold">
                          ₹{Number(item.subtotal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm cart-summary-card">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Order Summary</h4>

              {/* Items */}
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Items</span>
                <span className="fw-semibold">{cart.length}</span>
              </div>

              {/* Quantity */}
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Total Quantity</span>
                <span className="fw-semibold">{cartQuantity}</span>
              </div>

              {/* Subtotal */}
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>

                <span className="fw-semibold d-flex justify-content-between align-items-center">
                  <FaIndianRupeeSign size={15} />
                  {Number(cartTotal).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Delivery */}
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Delivery</span>
                <span className="text-success fw-semibold">Free</span>
              </div>

              <hr />

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold">Total</span>
                <span className="fs-4 fw-bold text-primary d-flex justify-content-between align-items-center">
                  <FaIndianRupeeSign size={19} />
                  {Number(cartTotal).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Checkout */}
              <button
                type="button"
                className="btn btn-dark btn-lg w-100"
                disabled={cart.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
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
export default CartPage;
