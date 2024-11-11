import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import "../../Style/SignIn.css";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Import Spinner for loader
import { useAuth } from "../../context/AuthContext"; // Import Auth Context

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      const errorMessage = getFriendlyErrorMessage(err.code);
      setError(errorMessage);
    }
  };

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email. Please sign up or try with a different email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container _login_container">
      {loading ? (
        <div className="full-screen-loader">
          <Spinner animation="border" role="status" className="spinner-lg">
            <span className="visually-hidden" style={{ color: "#fff" }}>
              Loading...
            </span>
          </Spinner>
          <p>Logging In...</p>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6 login_form_container">
            <p className="form_cancle">
              <i class="bi bi-x-square" onClick={() => navigate("/home")}></i>
            </p>
            <h2 className="text-center">Sign In</h2>
            <form className="_login_form" onSubmit={handleSignIn}>
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
                    type={showPassword ? "text" : "password"}
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
              <div className="text-end">
                <p
                  className="text-white"
                  onClick={() => navigate("/forgot_password")}
                  style={{ cursor: "pointer" }}
                >
                  Forgot Password
                </p>
              </div>

              {error && <p className="text-danger">{error}</p>}

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
              </div>

              <div className="create_account">
                <p className="text-white text-center pt-3">
                  Create an Account?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    style={{
                      color: "#0D6EFD",
                      cursor: "pointer",
                      letterSpacing: "1px",
                    }}
                  >
                    Sign Up
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

export default SignIn;
