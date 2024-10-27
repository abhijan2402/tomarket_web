import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Import Spinner for loader

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding confirm password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for managing loader

  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match. Please make sure both passwords are identical."
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false); // Show loader
      navigate("/");
      alert("Sign-up successful! Welcome!");
    } catch (err) {
      setLoading(false); // Show loader
      // Map Firebase errors to user-friendly messages
      const errorMessage = getFriendlyErrorMessage(err.code);
      setError(errorMessage);
    }
  };

  // Helper function to map Firebase errors to user-friendly messages
  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already associated with an account. Please use a different email or log in.";
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger password with at least 6 characters.";
      case "auth/operation-not-allowed":
        return "Account creation is currently disabled. Please contact support.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container _login_container">
      {loading === true ? (
        <div className="full-screen-loader">
          <Spinner animation="border" role="status" className="spinner-lg">
            <span className="visually-hidden" style={{ color: "#fff" }}>
              Loading...
            </span>
          </Spinner>
          <p>Wait your account is being created...</p>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6 login_form_container">
            <h2 className="text-center">Sign Up</h2>
            <form className="_login_form" onSubmit={handleCreateAccount}>
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

              <div className="mb-3">
                <label htmlFor="password" className="form-label text-white">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer", height: "46px" }}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="confirmPassword"
                  className="form-label text-white"
                >
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"} // Toggle input type based on showConfirmPassword state
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ cursor: "pointer", height: "46px" }}
                  >
                    {showConfirmPassword ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </span>
                </div>
              </div>

              {error && <p className="text-danger">{error}</p>}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>

              <div className="create_account">
                <p className="text-white text-center pt-3">
                  Already have an Account?{" "}
                  <span
                    onClick={() => navigate("/Login")}
                    style={{
                      color: "#0D6EFD",
                      cursor: "pointer",
                      letterSpacing: "1px",
                    }}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
