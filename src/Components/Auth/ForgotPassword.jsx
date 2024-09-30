import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const resp = await sendPasswordResetEmail(
        auth,
        "abhishek.jangid@gmail.com"
      );
      console.log(resp, "RESP");

      // setMessage("Password reset email sent! Please check your inbox."); // Success message
      // setError(''); // Clear any previous error messages
    } catch (err) {
      // setError(err.message);
      // setMessage(''); // Clear success message on error
    }
  };
  return <div>ForgotPassword</div>;
}

export default ForgotPassword;
