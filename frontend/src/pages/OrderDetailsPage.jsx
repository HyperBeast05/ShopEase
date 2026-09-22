import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { FaArrowLeft, FaBoxOpen, FaIndianRupeeSign } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${id}`);

        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);

        setError(error.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmed) return;

    try {
      setCancelling(true);
      setCancelError("");

      await api.put(`/orders/${id}/cancel`);

      setOrder((currentOrder) => ({
        ...currentOrder,
        status: "cancelled",
      }));
    } catch (error) {
      console.error("Error cancelling order:", error);

      setCancelError(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";

      case "processing":
        return "bg-info text-dark";

      case "shipped":
        return "bg-primary";

      case "delivered":
        return "bg-success";

      case "cancelled":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/products" className="btn btn-outline-dark">
          <FaArrowLeft className="me-2" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Success Message */}
      <div className="text-center mb-5">
        <FaCheckCircle className="text-success mb-3" size={60} />

        <h2 className="fw-bold">Order Details</h2>

        <p className="text-muted mb-0">view the details of your order.</p>
      </div>

      {/* Order Information */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <small className="text-muted">Order ID</small>

              <div className="fw-bold">#{order.order_id}</div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">Status</small>

              <div className="mt-1">
                <div className="d-flex align-items-center gap-3 mt-1">
                  <span
                    className={`badge text-capitalize ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>

                  {order.status === "pending" && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={cancelling}
                      onClick={handleCancelOrder}
                    >
                      {cancelling ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}
                </div>
                {cancelError && (
                  <div className="alert alert-danger mt-2 mb-0" role="alert">
                    {cancelError}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">Order Date</small>

              <div className="fw-semibold">
                {new Date(order.created_at).toLocaleDateString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Order Items */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <FaBoxOpen className="me-2" />
                Order Items
              </h5>

              {order.items.map((item) => (
                <div
                  key={item.order_item_id}
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

                  <div className="text-end">
                    <div className="fw-semibold">
                      <FaIndianRupeeSign className="me-1" />
                      {Number(item.price).toLocaleString("en-IN")}
                    </div>

                    <small className="text-muted">* {item.quantity}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-bold">Total</span>

                <span className="fs-5 fw-bold text-primary">
                  <FaIndianRupeeSign className="me-1" />
                  {Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>

              <Link to="/products" className="btn btn-primary w-100 mt-4">
                Continue Shopping
              </Link>

              <Link to="/orders" className="btn btn-outline-dark w-100 mt-2">
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
