import {
  FaArrowRight,
  FaTruck,
  FaShield,
  FaHeadset,
  FaBoxOpen,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75 py-5">
            <div className="col-lg-7">
              <span className="badge text-bg-primary mb-3 px-3 py-2">
                Welcome to ShopEase
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Shop smarter
                <br />
                Find what you love.
              </h1>

              <p className="lead text-muted mb-4">
                Discover quality products at great prices and enjoy a simple,
                secure, and convenient shopping experience.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link
                  to="/products"
                  className="btn btn-dark btn-lg d-flex justify-content-center align-items-center gap-2"
                >
                  Explore Products
                  <FaArrowRight />
                </Link>

                <Link to="/register" className="btn btn-outline-dark btn-lg">
                  Create Account
                </Link>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80"
                  alt="Online shopping"
                  className="img-fluid hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Shop With Us</h2>

            <p className="text-muted">
              Everything you need for a better shopping experience.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card h-100 text-center">
                <div className="feature-icon">
                  <FaTruck />
                </div>

                <h4 className="fw-bold">Fast Delivery</h4>

                <p className="text-muted mb-0">
                  Get your products delivered quickly and safely.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card h-100 text-center">
                <div className="feature-icon">
                  <FaShield />
                </div>

                <h4 className="fw-bold">Secure Shopping</h4>
                <p className="text-muted mb-0">
                  Your information and shopping experience are protected.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card h-100 text-center">
                <div className="feature-icon">
                  <FaHeadset />
                </div>

                <h4 className="fw-bold">Customer Support</h4>

                <p className="text-muted mb-0">
                  We're here to help whenever you need assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Products CTA */}
      <section className="py-5">
        <div className="container">
          <div className="home-products-cta text-center">
            <FaBoxOpen className="home-products-icon mb-3" />

            <h2 className="fw-bold">Ready to Start Shopping?</h2>

            <p className="text-muted mb-4">
              Explore our collection and find products that suit you.
            </p>

            <Link
              to="/products"
              className="btn btn-primary btn-lg d-inline-flex justify-content-center align-items-center gap-2"
            >
              Browse Products
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
