import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlecreateAccount = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        "abhishek.jangid@gmail.com",
        "123456"
      );
      alert("Sign-in successful!"); // You can redirect or perform any action
    } catch (err) {
      setError(err.message);
    }
  };
  return <div>SignUp</div>;
}

export default SignUp;
