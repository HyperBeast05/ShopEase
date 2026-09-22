import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaClipboardList,
  FaEye,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders/admin/all");
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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading orders...</p>
      </div>
    );
  }
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "text-bg-warning";

      case "processing":
        return "text-bg-primary";

      case "shipped":
        return "text-bg-info";

      case "delivered":
        return "text-bg-success";

      case "cancelled":
        return "text-bg-danger";

      default:
        return "text-bg-secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      String(order.order_id).includes(normalizedSearch) ||
      String(order.customer_name ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(order.customer_email ?? "")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage,
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <FaClipboardList className="text-primary me-2" />

          <h2 className="fw-bold mb-0">Manage Orders</h2>
        </div>

        <p className="text-muted mb-0">
          View customer orders and their details.
        </p>

        <span className="badge bg-primary mt-2">
          Total Orders: {orders.length}
        </span>

        <p className="text-muted mt-2">
          Showing{" "}
          <span className="fw-semibold text-dark">{filteredOrders.length}</span>{" "}
          {filteredOrders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Orders */}
      <div className="card border-0 shadow-sm">
        {/* Filters */}
        <div className="card-body p-4 border-bottom">
          <div className="row g-3">
            <div className="col-lg-8">
              <label htmlFor="orderSearch" className="form-label fw-semibold">
                Search Orders
              </label>

              <input
                type="text"
                id="orderSearch"
                className="form-control"
                placeholder="Search by order ID, customer name, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
              <label htmlFor="statusFilter" className="form-label fw-semibold">
                Status
              </label>

              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-lg-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                disabled={!searchTerm && statusFilter === "all"}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {orders.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted mb-0">No orders found.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted mb-0">No orders match your filters</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="fw-semibold">#{order.order_id}</td>

                      <td>{order.customer_name}</td>
                      <td>{order.customer_email}</td>
                      <td className="fw-semibold">
                        <FaIndianRupeeSign />
                        {Number(order.total_amount).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(order.status)} fs-6`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </td>

                      <td className="text-end">
                        <Link
                          to={`/admin/orders/${order.order_id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <FaEye className="me-1" />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center p-4 border-top">
              <nav aria-label="Orders pagination">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage((page) => page - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaAnglesLeft className="me-1" />
                    </button>
                  </li>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage((page) => page + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FaAnglesRight className="ms-1" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminOrdersPage;
