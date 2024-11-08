import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Import Firebase authentication

const Topbar = ({ Logo }) => {
  const [user, setUser] = useState(null);
  const location = useLocation(); // Get location object

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div>
      <header className="navbar">
        <div className="logo">
          <Link to="/">
            <img
              src={Logo[0]?.value}
              alt="Description of the logo"
              width="50"
              height="50"
              style={{ objectFit: "cover", borderRadius: "5px" }}
            />
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {!["/", "/Frens", "/Wallet", "/task"].includes(location.pathname) && (
            <div className="header_log">
              <Link to="/task">
                <button>
                  <i className="bi bi-plus-circle"></i> Task
                </button>
              </Link>
            </div>
          )}

          {/* Dropdown on hover */}
          <div className="dropdown">
            <div
              className="three-dots dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </div>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              {/* Conditionally render Login or Logout based on the user's state */}
              {!user ? (
                <li>
                  <Link className="dropdown-item" to="/login">
                    Login{" "}
                    <i
                      style={{ marginLeft: "6px" }}
                      className="bi bi-box-arrow-in-left"
                    ></i>
                  </Link>
                </li>
              ) : (
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log Out{" "}
                    <i
                      style={{ marginLeft: "6px" }}
                      className="bi bi-box-arrow-right"
                    ></i>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Topbar;
