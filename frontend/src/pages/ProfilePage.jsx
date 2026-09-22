import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaArrowLeft,
  FaEnvelope,
  FaKey,
  FaPen,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaSave } from "react-icons/fa";
import api from "../api/axios";

function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .required("Name is required"),
  });

  const formik = useFormik({
    initialValues: { name: user?.name || "" },

    validationSchema,

    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      setSuccess("");

      try {
        const response = await api.put("/users/profile", {
          name: values.name.trim(),
        });

        updateUser(response.data.user);

        setSuccess(response.data.message);
        setIsEditing(false);
      } catch (error) {
        console.error("Update profile errors:", error);

        formik.setStatus(
          error.response?.data?.message || "Failed to update profile.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    formik.setStatus("");
    setSuccess("");
    setIsEditing(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <FaUser size={40} />
                </div>

                <h2 className="fw-bold mb-2">My Profile</h2>

                <p className="text-muted mb-0">
                  Manage your account information.
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
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Name
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className={`form-control ${
                        isEditing &&
                        (formik.touched.name || formik.submitCount > 0) &&
                        formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!isEditing || formik.isSubmitting}
                    />
                  </div>

                  {isEditing &&
                    (formik.touched.name || formik.submitCount > 0) &&
                    formik.errors.name && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.name}
                      </div>
                    )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>

                    <input
                      type="email"
                      id="email"
                      className="form-control bg-light"
                      value={user?.email || ""}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="form-text">
                    Email address cannot be changed here
                  </div>
                </div>

                {/* Buttons */}

                {isEditing ? (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary flex-grow-1 d-flex justify-content-center align-items-center gap-2"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex justify-content-center align-items-center gap-2"
                      onClick={handleCancel}
                      disabled={formik.isSubmitting}
                    >
                      <FaXmark />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2 mb-2"
                      onClick={() => {
                        setSuccess("");
                        formik.setStatus("");
                        setIsEditing(true);
                      }}
                    >
                      <FaPen />
                      Edit Profile
                    </button>

                    <Link
                      to="/change-password"
                      className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2"
                    >
                      <FaKey />
                      Change Password
                    </Link>
                  </>
                )}
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

export default ProfilePage;
