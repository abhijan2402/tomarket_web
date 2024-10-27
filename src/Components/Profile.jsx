import React from "react";
import "../Style/Profile.css"; // Import your custom CSS

function Profile() {
  const userProfile = {
    name: "John Doe",
    email: "johndoe@example.com",
    profileImage: "https://via.placeholder.com/150", // Replace with actual profile image URL
  };

  return (
    <div className="container profile-container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-8 col-12 profile-card">
          <div className="card">
            <div className="card-body text-center">
              {/* Profile Image */}
              <img
                src={userProfile.profileImage}
                alt="Profile"
                className="rounded-circle profile-img"
              />
              {/* Name */}
              <h4 className="mt-3">{userProfile.name}</h4>
              {/* Email */}
              <p className="text-muted">{userProfile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
