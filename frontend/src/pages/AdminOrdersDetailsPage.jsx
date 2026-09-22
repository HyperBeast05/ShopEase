import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaEnvelope,
  FaIndianRupeeSign,
  FaUser,
} from "react-icons/fa6";

function AdminOrderDetailsPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const allowedTransitions = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/admin/${id}`);

        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching admin order:", error);

        setError(
          error.response?.data?.message || "Failed to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      setUpdatingStatus(true);
      setStatusError("");

      const response = await api.put(`/orders/admin/${id}/status`, {
        status: newStatus,
      });

      setOrder((currentOrder) => ({
        ...currentOrder,
        status: response.data.data.status,
      }));
    } catch (error) {
      console.error("Error updating order status:", error);

      setStatusError(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading Order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>

        <Link to="/admin/orders" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" />
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container py-5">
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/admin/orders" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-2" />
          Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold mb-1">Order #{order.order_id}</h2>

          <p className="text-muted mb-0">View complete order information.</p>
        </div>

        <div className="text-end">
          <div className="d-flex align-items-center justify-content-end gap-2">
            <select
              className="form-select"
              value={order.status}
              onChange={handleStatusChange}
              disabled={
                updatingStatus ||
                order.status === "delivered" ||
                order.status === "cancelled"
              }
              style={{ width: "160px" }}
            >
              <option value={order.status}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </option>

              {allowedTransitions[order.status].map((nextStatus) => (
                <option key={nextStatus} value={nextStatus}>
                  {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                </option>
              ))}
            </select>

            {updatingStatus && (
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Updating...</span>
              </div>
            )}
          </div>

          {statusError && (
            <div className="alert alert-danger mt-2 mb-0" role="alert">
              {statusError}
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Customer information */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <FaUser className="text-primary me-2" />

                <h5 className="fw-bold mb-0">Customer</h5>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Name</small>

                <span className="fw-semibold">{order.customer.name}</span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Email</small>

                <div className="d-flex align-items-center">
                  <FaEnvelope className="text-muted me-2" />
                  <span>{order.customer.email}</span>
                </div>
              </div>

              <div>
                <small className="text-muted d-block">Customer ID</small>

                <span className="fw-semibold">#{order.customer.user_id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <FaBoxOpen className="text-primary me-2" />

                <h5 className="fw-bold mb-0">Order Items</h5>
              </div>
              {order.items.length === 0 ? (
                <p className="text-muted mb-0">No items found for this order</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.order_item_id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  width="50"
                                  height="50"
                                  className="rounded object-fit-cover me-3"
                                />
                              )}

                              <span className="fw-semibold">{item.name}</span>
                            </div>
                          </td>

                          <td>
                            <FaIndianRupeeSign className="me-1" />
                            {Number(item.price).toLocaleString("en-IN")}
                          </td>

                          <td>{item.quantity}</td>
                          <td className="text-end fw-semibold">
                            <FaIndianRupeeSign className="me-1" />
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">Total</span>

                <span className="fw-bold fs-4 text-primary">
                  <FaIndianRupeeSign className="me-1" />
                  {Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailsPage;
