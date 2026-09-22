import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

function LoginPage() {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  //1.Yup schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter a valid email address")
      .required("Email is required"),

    password: Yup.string().required("Password is required"),
  });

  //2.Formik
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setSuccessMessage("");

      try {
        const response = await api.post("/auth/login", {
          email: values.email.trim(),
          password: values.password,
        });

        login(response.data.user, response.data.token);

        const from = location.state?.from || "/";

        navigate(from, { replace: true });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Login failed. Please check your email and password.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow rounded-3">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 fw-bold">Login</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control ${
                      formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="text-end mt-2">
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
