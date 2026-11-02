import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaClipboardList, FaKey, FaUser } from "react-icons/fa6";
import { useCart } from "../context/useCart";

function Navbar() {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const { cartQuantity, clearCart } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2"
          to="/"
        >
          <FaShoppingBag />
          <span>ShopEase</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Left Navigation */}
          <ul className="navbar-nav ms-lg-4">
            <li className="nav-item">
              <NavLink
                className="nav-link d-flex align-items-center gap-2"
                to="/"
              >
                <FaHome />
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link d-flex align-items-center gap-2"
                to="/products"
              >
                <FaBoxOpen />
                Products
              </NavLink>
            </li>
          </ul>

          {/* Right Navigation */}
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
            {isLoggedIn ? (
              <>
                {/* Account Dropdown */}
                <div className="dropdown account-dropdown">
                  <button
                    className="btn btn-outline-light account-button dropdown-toggle d-flex justify-content-center align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUser />
                    <span>Hello, {user.name}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    {/* Profile */}
                    <li>
                      <Link
                        to="/profile"
                        className="dropdown-item d-flex align-items-center gap-2"
                      >
                        <FaUser />
                        My Profile
                      </Link>
                    </li>

                    {/* My Orders */}
                    <li>
                      <Link
                        to="/orders"
                        className="dropdown-item d-flex align-items-center gap-2"
                      >
                        <FaClipboardList />
                        My Orders
                      </Link>
                    </li>

                    {/* Change Password */}
                    <li>
                      <Link
                        to="/change-password"
                        className="dropdown-item d-flex align-items-center gap-2"
                      >
                        <FaKey />
                        Change Password
                      </Link>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    {/* Logout */}
                    <li>
                      <button
                        type="button"
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Cart */}
                <NavLink
                  to="/cart"
                  className="btn btn-outline-light d-flex justify-content-center align-items-center gap-2"
                >
                  <FaShoppingCart />
                  Cart
                  <span className="badge rounded-pill text-bg-danger">
                    {cartQuantity}
                  </span>
                </NavLink>
              </>
            ) : (
              <>
                {/* Login */}
                <NavLink
                  to="/login"
                  className="btn btn-outline-light navbar-action-button d-flex justify-content-center align-items-center gap-2"
                >
                  <FaSignInAlt />
                  Login
                </NavLink>

                {/* Register */}
                <NavLink
                  to="/register"
                  className="btn btn-outline-light navbar-action-button d-flex justify-content-center align-items-center gap-2"
                >
                  <FaUserPlus />
                  Register
                </NavLink>

                {/* Cart */}
                <NavLink
                  to="/cart"
                  className="btn btn-outline-light navbar-cart d-flex justify-content-center align-items-center gap-2"
                >
                  <FaShoppingCart />
                  Cart
                  <span className="badge rounded-pill text-bg-danger">
                    {cartQuantity}
                  </span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
