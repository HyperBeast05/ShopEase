import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowsRotate,
  FaEye,
  FaIndianRupeeSign,
  FaSearchengin,
  FaUserGroup,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 5;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/admin/all");

        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);

        setError(error.response?.data?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response = await api.get(`/users/admin/all`);

      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error refreshing customers:", error);

      setError(error.response?.data?.message || "Failed to refresh customers");
    } finally {
      setRefreshing(false);
    }
  };

  //Search Customers
  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.trim().toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText) ||
      customer.id.toString().includes(searchText)
    );
  });

  //Customer Statistics
  const totalCustomers = customers.length;

  const customerWithOrders = customers.filter(
    (customer) => Number(customer.total_orders) > 0,
  ).length;

  const totalRevenue = customers.reduce(
    (total, customer) => total + Number(customer.total_spent),
    0,
  );

  //pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const startIndex = (currentPage - 1) * customersPerPage;

  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + customersPerPage,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Customers</h2>

          <p className="text-muted mb-0">View registered customers.</p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Refreshing...
            </>
          ) : (
            <>
              <FaArrowsRotate className="me-2" />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Customer Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
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
                  <FaUserGroup size={20} />
                </div>

                <div className="ms-3">
                  <small className="text-muted d-block mb-2">
                    Total Customers
                  </small>
                  <h4 className="fw-bold mb-0">{totalCustomers}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div
                  className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <FaUsers size={20} />
                </div>

                <div className="ms-3">
                  <small className="text-muted d-block mb-2">
                    Customers With Orders
                  </small>
                  <h4 className="fw-bold mb-0">{customerWithOrders}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div
                  className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <FaIndianRupeeSign size={20} />
                </div>

                <div className="ms-3">
                  <small className="text-muted d-block mb-2">
                    Total Revenue
                  </small>

                  <h4 className="fw-bold text-primary mb-0">
                    <FaIndianRupeeSign className="me-1" />
                    {totalRevenue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Total */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaSearchengin />
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name,email or customer ID..."
                    value={search}
                    onChange={handleSearch}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    disabled={!search}
                    style={{ cursor: "pointer" }}
                  >
                    <FaXmark className="me-1" />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <span className="text-muted">
                {search ? "Matching Customers:" : "Total Customers:"}{" "}
                <strong className="text-dark">
                  {filteredCustomers.length}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers */}
      {currentCustomers.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaUsers size={55} className="text-muted mb-3" />

            <h5 className="fw-bold">No Customers Found</h5>

            <p className="text-muted mb-0">
              {search
                ? "No customers match your search."
                : "No registered customers found."}
            </p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table
              className="table table-hover align-middle mb-0"
              style={{ minWidth: "1100px" }}
            >
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Customer ID</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Registered On</th>
                  <th>Activity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "42px",
                            height: "42px",
                          }}
                        >
                          <FaUsers />
                        </div>

                        <div className="ms-3">
                          <Link
                            to={`/admin/customers/${customer.id}`}
                            className="text-decoration-none text-dark fw-semibold"
                          >
                            {customer.name}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td>{customer.email}</td>

                    <td>
                      <span className="badge bg-light text-dark border">
                        #{customer.id}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-primary">
                        {customer.total_orders}
                      </span>
                    </td>

                    <td>
                      <span className="fw-semibold">
                        <FaIndianRupeeSign />
                        {Number(customer.total_spent).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    <td>
                      {new Date(customer.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>

                    <td>
                      {Number(customer.total_orders) > 0 ? (
                        <span className="badge bg-success">
                          Active Customer
                        </span>
                      ) : (
                        <span className="badge bg-secondary">No Orders</span>
                      )}
                    </td>

                    <td>
                      <Link
                        to={`/admin/customers/${customer.id}`}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white border-0 py-3">
              <div className="d-flex justify-content-center">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((page) => page - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaAnglesLeft />
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((page) => page + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FaAnglesRight />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminCustomersPage;
