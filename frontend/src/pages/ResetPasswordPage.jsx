import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { FaArrowLeft, FaEye, FaEyeSlash, FaKey, FaLock } from "react-icons/fa6";
import * as Yup from "yup";
import { useFormik } from "formik";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [success, setSuccess] = useState("");

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/,
        "Password must be at least 6 characters with one uppercase letter and one special character",
      )
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setSuccess("");

      if (!token) {
        formik.setFieldError("newPassword", "Invalid password reset link.");
        setSubmitting(false);
        return;
      }

      try {
        const response = await api.post("/auth/reset-password", {
          token,
          newPassword: values.newPassword,
        });

        setSuccess(response.data.message);

        formik.resetForm();

        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Password reset successfully. Please log in.",
            },
          });
        }, 1500);
      } catch (error) {
        console.error("Reset password error:", error);

        formik.setStatus(
          error.response?.data?.message || "Failed to reset password.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <FaKey size={40} />
                </div>

                <h2 className="fw-bold">Reset Password</h2>

                <p className="text-muted mb-0">
                  Enter your new password below.
                </p>
              </div>

              {formik.status && (
                <div className="alert alert-danger" role="alert">
                  {formik.status}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* New Password */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      className={`form-control ${
                        formik.touched.newPassword && formik.errors.newPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter new password"
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={formik.isSubmitting}
                      aria-describedby={
                        (formik.touched.newPassword ||
                          formik.submitCount > 0) &&
                        formik.errors.newPassword
                          ? "newPasswordError"
                          : undefined
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                      disabled={formik.isSubmitting}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {(formik.touched.newPassword || formik.submitCount > 0) &&
                    formik.errors.newPassword && (
                      <div
                        id="newPasswordError"
                        className="invalid-feedback d-block"
                      >
                        {formik.errors.newPassword}
                      </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Confirm new password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={formik.isSubmitting}
                      aria-describedby={
                        (formik.touched.confirmPassword ||
                          formik.submitCount > 0) &&
                        formik.errors.confirmPassword
                          ? "confirmPasswordError"
                          : undefined
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={formik.isSubmitting}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {(formik.touched.confirmPassword || formik.submitCount > 0) &&
                    formik.errors.confirmPassword && (
                      <div
                        id="confirmPasswordError"
                        className="invalid-feedback d-block"
                      >
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      ></span>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <FaKey className="me-2" />
                      Reset Password
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-4">
                <Link to="/login" className="text-decoration-none">
                  <FaArrowLeft className="me-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
