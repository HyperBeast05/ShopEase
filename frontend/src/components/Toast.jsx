import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className="shop-toast show position-fixed top-0 end-0 m-3"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Toast Content */}
      <div className="d-flex align-items-center p-3">
        {/* Icon */}
        <div
          className={`toast-icon ${
            isSuccess ? "toast-icon-success" : "toast-icon-error"
          }`}
        >
          {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
        </div>

        {/* Message */}
        <div className="flex-grow-1 ms-3">
          <span className="toast-message">{message}</span>
        </div>

        {/* close Button */}
        <button
          type="button"
          className="btn-close ms-2"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>

      {/* Progress Bar */}
      <div
        className={`toast-progress ${
          isSuccess ? "toast-progress-success" : "toast-progress-error"
        }`}
      ></div>
    </div>
  );
}
export default Toast;
