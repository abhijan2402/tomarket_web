import React from "react";
import "../Style/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="home_container">
        <div className="home_title">
          <h3>"Master Your Day, One Task at a Time"</h3>
        </div>
        <div className="main_img_container">
          <img
            src="https://miro.medium.com/v2/resize:fit:2560/1*qHb-LP4DHAefe1UBGGcnnA.png"
            alt=""
          />
        </div>

        <div className="home_desc">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam porro
            perspiciatis ab, nulla aut soluta cum commodi veritatis veniam
            delectus quod voluptatum. Obcaecati tempora vero doloremque quam
            recusandae nobis accusamus.
          </p>
        </div>
        <div className="img_collage">
          <img
            src="https://miro.medium.com/v2/resize:fit:2560/1*qHb-LP4DHAefe1UBGGcnnA.png"
            alt=""
          />
          <img
            src="https://miro.medium.com/v2/resize:fit:2560/1*qHb-LP4DHAefe1UBGGcnnA.png"
            alt=""
          />
        </div>
        <div className="home_redirection_btn" onClick={() => navigate("task")}>
          <span style={{ color: "goldenrod" }}>Let’s Get Started</span> – Create
          Your First Task! <i class="bi bi-box-arrow-in-up-right"></i>
        </div>
      </div>
    </>
  );
};

export default Home;
