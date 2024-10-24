import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import "../../Style/SignIn.css";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response, "RESP");
      navigate("/");
      alert("Sign-In successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container _login_container">
      <div className="row justify-content-center">
        <div className="col-md-6">
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
    </div>
  );
}

export default SignIn;
