import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Topbar = ({ Logo }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("You have been logged out successfully.");
        navigate("/home");
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
              alt="Logo"
              width="50"
              height="50"
              style={{ objectFit: "cover", borderRadius: "5px" }}
            />
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {!["/", "/Frens", "/Wallet", "/task", "/profile", "/home"].includes(
            location.pathname
          ) && (
            <div className="header_log">
              <Link to="/task">
                <button>
                  <i className="bi bi-plus-circle"></i> Task
                </button>
              </Link>
            </div>
          )}

          {/* Dropdown on click */}
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
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
