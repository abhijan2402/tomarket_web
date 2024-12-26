// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // Import Firestore config
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid); // Reference to user's document
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), uid: currentUser.uid }); // Save user data with UID
          } else {
            console.warn("No user document found for the current user.");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUser(null);
        }
      } else {
        setUser(null); // Clear user state when logged out
      }
      setLoading(false); // Set loading to false once user state is determined
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state on sign-out
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children} {/* Render children only after loading is false */}
    </AuthContext.Provider>
  );
};
