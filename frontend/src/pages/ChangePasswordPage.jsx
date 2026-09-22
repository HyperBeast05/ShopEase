import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../api/axios";
import { FaArrowLeft, FaEye, FaEyeSlash, FaKey, FaLock } from "react-icons/fa6";

function ChangePassword() {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [success, setSuccess] = useState("");

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),

    newPassword: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/,
        "Password must be at least 6 characters with one uppercase letter and one special character",
      )
      .required("New password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setSuccess("");

      try {
        const response = await api.put("/auth/change-password", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        setSuccess(response.data.message);

        formik.resetForm();

        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Password changed successfully. Please log in again.",
            },
          });
        }, 1500);
      } catch (error) {
        console.error("Change password error:", error);

        formik.setStatus(
          error.response?.data?.message || "Failed to change password.",
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
              {/* Header */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <FaKey size={40} />
                </div>

                <h2 className="fw-bold">Change Password</h2>

                <p className="text-muted mb-0">
                  Update your account password below.
                </p>
              </div>

              {/* Backend Error */}
              {formik.status && (
                <div className="alert alert-danger" role="alert">
                  {formik.status}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* Current Password */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>

                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      className={`form-control ${
                        (formik.touched.currentPassword ||
                          formik.submitCount > 0) &&
                        formik.errors.currentPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter current password"
                      value={formik.values.currentPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={formik.isSubmitting}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      disabled={formik.isSubmitting}
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                    {(formik.touched.currentPassword ||
                      formik.submitCount > 0) &&
                      formik.errors.currentPassword && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.currentPassword}
                        </div>
                      )}
                  </div>

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
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        className={`form-control ${
                          (formik.touched.newPassword ||
                            formik.submitCount > 0) &&
                          formik.errors.newPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter new password"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={formik.isSubmitting}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        disabled={formik.isSubmitting}
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {(formik.touched.newPassword || formik.submitCount > 0) &&
                      formik.errors.newPassword && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.newPassword}
                        </div>
                      )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
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
                          (formik.touched.confirmPassword ||
                            formik.submitCount > 0) &&
                          formik.errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Confirm new password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={formik.isSubmitting}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={formik.isSubmitting}
                        aria-label={
                          showConfirmPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {(formik.touched.confirmPassword ||
                      formik.submitCount > 0) &&
                      formik.errors.confirmPassword && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                  </div>

                  {/* Submit */}
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
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <FaKey className="me-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back */}
              <div className="text-center mt-4">
                <Link to="/" className="text-decoration-none">
                  <FaArrowLeft className="me-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
