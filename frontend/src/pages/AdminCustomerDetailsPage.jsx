import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaEnvelope,
  FaEye,
  FaIndianRupeeSign,
  FaUser,
  FaUserTag,
} from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function AdminCustomerDetailsPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "processing":
        return "bg-primary";
      case "shipped":
        return "bg-info text-dark";
      case "delivered":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/users/admin/${id}`);

        setCustomer(response.data.data);
      } catch (error) {
        console.error("Error fetching customer:", error);

        setError(error.response?.data?.message || "Failed to load Customer");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading Customer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>

        <Link to="/admin/customers" className="btn btn-outline-dark">
          <FaArrowLeft className="me-2" />
          Back to Customers
        </Link>
      </div>
    );
  }

  const totalOrders = customer?.orders?.length || 0;

  const totalSpent =
    customer?.orders?.reduce(
      (total, order) =>
        order.status !== "cancelled"
          ? total + Number(order.total_amount)
          : total,
      0,
    ) || 0;

  const activeOrders =
    customer?.orders?.filter((order) => order.status !== "cancelled").length ||
    0;

  const customerStatus = totalOrders > 0 ? "Active Customer" : "No Orders";

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Customer Details</h2>

          <p className="text-muted mb-0">View Customer information.</p>
        </div>

        <Link to="/admin/customers" className="btn btn-outline-dark">
          <FaArrowLeft className="me-2" />
          Customers
        </Link>
      </div>

      {/* Customer Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "64px",
                height: "64px",
              }}
            >
              <FaUser size={25} />
            </div>

            <div className="ms-3">
              <h4 className="fw-bold mb-1">{customer.name}</h4>

              <span className="badge bg-light text-dark border">
                Customer #{customer.id}
              </span>
            </div>
          </div>

          <hr />

          <div className="row g-4 mt-1">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaUserTag className="text-primary me-3" />

                <div>
                  <small className="text-muted d-block">Customer ID</small>

                  <span className="fw-semibold">#{customer.id}</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaEnvelope className="text-primary me-3" />

                <div>
                  <small className="text-muted d-block">Email</small>
                  <span className="fw-semibold">{customer.email}</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaUser className="text-primary me-3" />

                <div>
                  <small className="text-muted d-block">Name</small>

                  <span className="fw-semibold">{customer.name}</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaUserTag className="text-primary me-3" />

                <div>
                  <small className="text-muted d-block">Registered On</small>

                  <span className="fw-semibold">
                    {new Date(customer.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaUser className="text-primary me-3" />

                <div>
                  <small className="text-muted d-block">Customer Status</small>

                  <span
                    className={`badge ${customerStatus === "Active Customer" ? "bg-success" : "bg-secondary"}`}
                  >
                    {customerStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders */}
      <div className="card border-0 shadow-sm mt-4 px-4">
        {/* Order Summary */}
        <div className="row g-4 mt-4 mb-4">
          {/* Total Orders */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <FaBoxOpen size={20} />
                  </div>

                  <div className="ms-3">
                    <small className="text-muted d-block mb-2">
                      Total Orders
                    </small>

                    <h3 className="fw-bold mb-0">{totalOrders}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <FaIndianRupeeSign size={20} />
                  </div>

                  <div className="ms-3">
                    <small className="text-muted d-block mb-2">
                      Total Spent
                    </small>

                    <h3 className="fw-bold text-primary mb-0">
                      <FaIndianRupeeSign />
                      {totalSpent.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <FaBoxOpen size={20} />
                  </div>

                  <div className="ms-3">
                    <small className="text-muted d-block mb-2">
                      Active Orders
                    </small>

                    <h3 className="fw-bold text-success mb-0">
                      {activeOrders}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <FaBoxOpen className="text-primary me-2" size={22} />

            <h5 className="fw-bold mb-0">Customer Orders</h5>

            <span className="badge bg-primary ms-2">
              {customer.orders.length}
            </span>
          </div>

          {customer.orders.length === 0 ? (
            <div className="text-center py-4">
              <FaBoxOpen size={45} className="text-muted mb-3" />

              <h6 className="fw-bold">No Orders Found</h6>
              <p className="text-muted mb-0">
                This customer has not placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Ordered On</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customer.orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>
                        <Link
                          to={`/admin/orders/${order.order_id}`}
                          className="text-decoration-none"
                        >
                          <span className="badge bg-light text-dark border">
                            #{order.order_id}
                          </span>
                        </Link>
                      </td>

                      <td>
                        <FaIndianRupeeSign />
                        {Number(order.total_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>

                      <td>
                        <Link
                          to={`/admin/orders/${order.order_id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <FaEye className="me-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCustomerDetailsPage;
