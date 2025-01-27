import { collection, addDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SupportQuery = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Extract the title from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const titleParam = urlParams.get("title");
    if (titleParam) {
      setTitle(titleParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !user?.email) {
      alert("Please provide all required fields.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "queries"), {
        title,
        description,
        email: user.email,
        createdAt: new Date(),
        status: "pending",
      });
      alert("Your query has been submitted successfully!");
      navigate("/support");
    } catch (error) {
      console.error("Error submitting query: ", error);
      alert("There was an error submitting your query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "50px", paddingLeft: 15, paddingRight: 15 }}>
      <h3 style={{ color: "#fff", fontSize: 30, marginBottom: 50 }}>
        What issue are you facing?
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <label style={{ color: "#fff", fontSize: 18 }}>
          Title:{" "}
          <span style={{ fontWeight: "bold" }}>
            {title || "No title provided"}
          </span>
        </label>
        <textarea
          placeholder="Describe your issue here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: 15,
            fontSize: 16,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: "100%",
            color: "#fff",
            minHeight: "100px",
            background: "#000",
          }}
        />

        <button
          disabled={loading}
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </form>
    </div>
  );
};

export default SupportQuery;
