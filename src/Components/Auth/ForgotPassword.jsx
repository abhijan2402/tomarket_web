import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setError(""); // Clear any previous error messages
    } catch (err) {
      setError(err.message); // Set error message on failure
      setMessage(""); // Clear success message on error
    }
  };

  return (
    <div className="container _login_container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p
              style={{ fontSize: "35px", color: "#fff", cursor: "pointer" }}
              onClick={() => navigate("/Login")}
            >
              <i className="bi bi-arrow-left-circle-fill"></i>
            </p>
            <h2 className="">Reset Password</h2>
          </div>
          <form className="_login_form" onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white">
                Email address
              </label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
