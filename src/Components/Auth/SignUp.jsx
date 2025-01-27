import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useApp } from "../../context/AppContext";

function SignUp() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refferalPoint, joiningAmount } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get("referralCode");
    if (referralCode) {
      setReferralCodeInput(referralCode.trim());
    }
  }, [location.search]);

  // Function to generate a 6-character alphanumeric referral code
  const generateReferralCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  // Function to check if a referral code is unique in Firestore
  const isReferralCodeUnique = async (code) => {
    const q = query(collection(db, "users"), where("referralCode", "==", code));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  // Function to generate a unique referral code
  const generateUniqueReferralCode = async () => {
    let uniqueCode = generateReferralCode();
    while (!(await isReferralCodeUnique(uniqueCode))) {
      uniqueCode = generateReferralCode();
    }
    return uniqueCode;
  };

  const handleReferralCodeValidation = async (code) => {
    if (!code) return true; // If no code is provided, skip validation

    const q = query(
      collection(db, "users"),
      where("referralCode", "==", code.trim())
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setError("Invalid referral code.");
      return false;
    }

    // If valid, update the referred user's wallet
    const referredUserDoc = querySnapshot.docs[0];
    const referredUserRef = doc(db, "users", referredUserDoc.id);
    const referredUserData = referredUserDoc.data();
    const updatedPoints = (referredUserData.points || 0) + refferalPoint;

    await updateDoc(referredUserRef, { points: updatedPoints });
    return true;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate input
    if (name.trim() === "") {
      setLoading(false);
      setError("Name is required.");
      return;
    }

    if (!/^[a-zA-Z ]{2,50}$/.test(name)) {
      setLoading(false);
      setError("Name must contain only alphabets and be 2-50 characters long.");
      return;
    }

    if (age.trim() === "" || isNaN(age) || age < 18 || age > 120) {
      setLoading(false);
      setError("Please enter a valid age (must be between 18 and 120).");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError(
        "Passwords do not match. Please ensure both passwords are identical."
      );
      return;
    }

    // Validate referral code
    const isReferralValid = await handleReferralCodeValidation(
      referralCodeInput
    );
    if (!isReferralValid) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Generate a unique referral code
      const referralCode = await generateUniqueReferralCode();

      // Add user to Firestore
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        age: parseInt(age, 10),
        email: user.email,
        wallet: joiningAmount,
        userID: user.uid,
        referralCode, // Save the generated referral code
        referredBy: referralCodeInput.trim() || null, // Save the entered referral code (if any)
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      navigate("/");
      alert("Sign-up successful! Welcome!");
    } catch (err) {
      setLoading(false);
      const errorMessage = getFriendlyErrorMessage(err.code);
      setError(errorMessage);
    }
  };

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already associated with an account. Please use a different email or log in.";
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger password with at least 6 characters.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
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
          <p>Wait your account is being created...</p>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6 login_form_container">
            <h2 className="text-center">Sign Up</h2>
            <form className="_login_form" onSubmit={handleCreateAccount}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label text-white">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="age" className="form-label text-white">
                  Age
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="18"
                  max="120"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">
                  Email address
                </label>
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
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
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
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showConfirmPassword ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="referralCode" className="form-label text-white">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="referralCode"
                  placeholder="Enter referral code"
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value)}
                />
              </div>

              {error && <p className="text-danger">{error}</p>}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>

              <p className="text-white text-center pt-3">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{ color: "#0D6EFD", cursor: "pointer" }}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
