import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaIndianRupeeSign } from "react-icons/fa6";

function CheckoutPage() {
  const { cart, cartQuantity, cartTotal, loading, error, createOrder } =
    useContext(CartContext);

  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setOrderError("");

      const response = await createOrder();
      const orderId = response.data.order_id;

      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);

      setOrderError(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3 text-muted">Loading Checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/cart" className="btn btn-outline-dark">
          <FaArrowLeft className="me-2" />
          Back to Cart
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FaBoxOpen className="text-muted mb-3" size={60} />
          <h3>Your cart is empty</h3>

          <p className="text-muted">
            Add some products before proceeding to checkout.
          </p>

          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/cart" className="text-decoration-none">
          <FaArrowLeft className="me-2" />
          Back to Cart
        </Link>
      </div>

      <h2 className="fw-bold mb-4">Checkout</h2>

      {/* Order Placement Error */}
      {orderError && (
        <div className="alert alert-danger" role="alert">
          {orderError}
        </div>
      )}

      <div className="row g-4">
        {/* Order Items */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order Items</h5>

              {cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="d-flex align-items-center border-bottom py-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">
                      Quantity: {item.quantity}
                    </small>
                  </div>

                  <div className="fw-semibold">
                    <FaIndianRupeeSign className="me-1" />
                    {Number(item.subtotal).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Items</span>
                <span className="fw-semibold">{cart.length}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Total quantity</span>
                <span className="fw-semibold">{cartQuantity}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-bold">Total</span>

                <span className="fs-5 fw-bold text-primary">
                  <FaIndianRupeeSign className="me-1" />
                  {Number(cartTotal).toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 mt-4"
                disabled={placingOrder}
                onClick={handlePlaceOrder}
              >
                {placingOrder ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
