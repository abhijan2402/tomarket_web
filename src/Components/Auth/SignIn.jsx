import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        "abhishek.jangid@gmail.com",
        "123456"
      );
      console.log(response, "RESP");

      alert("Sign-in successful!"); // You can redirect or perform any action
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <button onClick={handleSignIn} style={{ marginTop: "10px" }}>
        Click Me
      </button>
    </div>
  );
}

export default SignIn;
