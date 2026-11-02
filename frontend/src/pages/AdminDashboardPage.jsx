import { useCallback, useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import {
  FaArrowRight,
  FaArrowsRotate,
  FaClipboardList,
  FaTags,
  FaUsers,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import api from "../api/axios";

function AdminDashboardPage() {
  const [customerCount, setCustomerCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardCounts = useCallback(async () => {
    try {
      setRefreshing(true);
      setError("");

      const [
        customersResponse,
        ordersResponse,
        productsResponse,
        categoriesResponse,
      ] = await Promise.all([
        api.get("/users/admin/all"),
        api.get("/orders/admin/all"),
        api.get("/products"),
        api.get("/categories"),
      ]);

      setCustomerCount(customersResponse.data.totalCustomers);
      setOrderCount(ordersResponse.data.totalOrders);
      setProductCount(productsResponse.data.data.length);
      setCategoryCount(categoriesResponse.data.data.length);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);

      setError(
        error.response?.data?.message || "Failed to load dashboard data",
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const loadDashboardCounts = async () => {
      await fetchDashboardCounts();
    };
    loadDashboardCounts();
  }, [fetchDashboardCounts]);

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="mb-5">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>

        <p className="text-muted mb-0">Manage your store from one place.</p>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={fetchDashboardCounts}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
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

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={fetchDashboardCounts}
            disabled={refreshing}
          >
            Retry
          </button>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="row g-4">
        <div className="col-md-6 col-xl-3">
          <Link to="/admin/products" className="text-decoration-none text-dark">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <FaBoxOpen size={30} className="text-primary mb-3" />
                <h5 className="fw-bold">Products</h5>

                <p className="text-muted mb-0">Manage your store products.</p>

                <h4 className="fw-bold mb-0">{productCount}</h4>
                <div className="mt-3 text-primary small fw-semibold">
                  View Products <FaArrowRight className="ms-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-xl-3">
          <Link
            to="/admin/categories"
            className="text-decoration-none text-dark"
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <FaTags size={30} className="text-primary mb-3" />

                <h5 className="fw-bold">Categories</h5>
                <p className="text-muted mb-0">Manage product categories.</p>

                <h4 className="fw-bold mb-0">{categoryCount}</h4>
                <div className="mt-3 text-primary small fw-semibold">
                  View Categories <FaArrowRight className="ms-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-xl-3">
          <Link to="/admin/orders" className="text-decoration-none text-dark">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <FaClipboardList size={30} className="text-primary mb-3" />
                <h5 className="fw-bold">Orders</h5>

                <p className="text-muted mb-0">
                  View and Manage customer orders.
                </p>

                <h4 className="fw-bold mb-0">{orderCount}</h4>
                <div className="mt-3 text-primary small fw-semibold">
                  View Orders <FaArrowRight className="ms-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-xl-3">
          <Link
            to="/admin/customers"
            className="text-decoration-none text-dark"
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <FaUsers size={30} className="text-primary mb-3" />
                <h5 className="fw-bold">Customers</h5>
                <p className="text-muted mb-0">View registered customers.</p>

                <h4 className="fw-bold mb-0">{customerCount}</h4>
                <div className="mt-3 text-primary small fw-semibold">
                  View Customers <FaArrowRight className="ms-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboardPage;
