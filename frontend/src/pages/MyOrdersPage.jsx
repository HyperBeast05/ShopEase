import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaEye, FaIndianRupeeSign } from "react-icons/fa6";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders");

        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);

        setError(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      setCancelError("");

      await api.put(`/orders/${orderId}/cancel`);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, status: "cancelled" }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error cancelling order:", error);

      setCancelError(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
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

        <p className="text-muted mt-3">Loading your orders...</p>
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
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <FaBoxOpen className="text-muted mb-3" size={65} />
          <h3 className="fw-bold">No Orders Yet</h3>
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>

          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Orders</h2>
        <p className="text-muted mb-0">View and manage your recent orders.</p>
      </div>

      {cancelError && (
        <div className="alert alert-danger mt-3 mb-0" role="alert">
          {cancelError}
        </div>
      )}

      <div className="row g-4">
        {orders.map((order) => (
          <div key={order.order_id} className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                {/* Order Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                  <div>
                    <small className="text-muted">Order ID</small>
                    <h5 className="fw-bold mb-1">#{order.order_id}</h5>

                    <small className="text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </small>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <span
                      className={`badge text-capitalize ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>

                    <Link
                      to={`/orders/${order.order_id}`}
                      className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
                    >
                      <FaEye />
                      View Details
                    </Link>

                    {order.status === "pending" && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        disabled={cancellingOrderId === order.order_id}
                        onClick={() => handleCancelOrder(order.order_id)}
                      >
                        {cancellingOrderId === order.order_id ? (
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
                </div>

                {/* Items */}
                <div className="border-top pt-3">
                  {order.items.map((item) => (
                    <div
                      key={item.order_items_id}
                      className="d-flex align-items-center py-3 border-bottom"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="rounded"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />

                      <div className="flex-grow-1 ms-3">
                        <h6 className="fw-semibold mb-1">{item.name}</h6>
                        <small className="text-muted">
                          Quantity: {item.quantity}
                        </small>
                      </div>

                      <div className="text-end">
                        <div className="fw-semibold">
                          <FaIndianRupeeSign className="me-1" />
                          {Number(item.price).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="d-flex justify-content-between align-items-center pt-4">
                  <span className="fw-semibold text-muted">Order Total</span>

                  <span className="fs-5 fw-bold text-primary">
                    <FaIndianRupeeSign className="me-1" />
                    {Number(order.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MyOrdersPage;
