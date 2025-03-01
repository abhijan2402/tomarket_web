import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { Logo } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <img
            style={{ width: 100, margin: "auto" }}
            src={Logo[0]?.value}
            alt=""
          />
        </div>
        <h1 style={{ marginTop: 20, color: "#fff", fontSize: "2.375rem" }}>
          Simple Ways to Make Money Online
        </h1>
        <p
          style={{
            marginTop: 20,
            color: "#fff",
            fontSize: "1.375rem",
            opacity: 0.8,
          }}
        >
          Turn your spare time into earnings today. Play games, take surveys,
          and explore other easy ways to make money online with Mila.
        </p>
        <button
          style={{
            marginTop: 40,
            backgroundColor: "#416ef0",
            borderRadius: 40,
            padding: "15px 40px",
          }}
          onClick={() => navigate("/login")}
        >
          Start Making Money Now
        </button>
      </div>

      <div style={{ marginTop: 40 }} class="MuiBox-root css-ns40r2">
        <h2
          class="MuiTypography-root MuiTypography-h3 css-14g5i2i"
          id="Our vision"
        >
          Our vision
        </h2>
        <div
          class="MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter css-15hxlbu"
          style={{ textAlign: "center" }}
        >
          Mila helps people make money online by offering simple and easy
          ways to earn. Our platform gives everyone access to a wide variety of
          small tasks, allowing users to earn extra income from anywhere. With
          no special skills needed, Mila makes it possible for anyone to
          start earning and be part of the online economy.
        </div>
        <div class="MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row css-zgzk0s">
          <div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-sm-6 MuiGrid2-grid-md-4 css-16cvqyc">
            <div
              class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1ouemme"
              style={{
                shadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
            >
              <div class="MuiCardContent-root css-15q2cw4">
                <div class="MuiTypography-root MuiTypography-h6 css-yp1y4z">
                  Total paid out
                </div>
                <div class="MuiTypography-root MuiTypography-h4 css-1c3irsm">
                  2 947 049
                </div>
              </div>
            </div>
          </div>
          <div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-sm-6 MuiGrid2-grid-md-4 css-16cvqyc">
            <div
              class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-rneoxq"
              style={{
                shadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
            >
              <div class="MuiCardContent-root css-15q2cw4">
                <div class="MuiTypography-root MuiTypography-h6 css-yp1y4z">
                  Registered users
                </div>
                <div class="MuiTypography-root MuiTypography-h4 css-1c3irsm">
                  9 459 495
                </div>
              </div>
            </div>
          </div>
          <div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-sm-6 MuiGrid2-grid-md-4 css-16cvqyc">
            <div
              class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1pvtlkb"
              style={{
                shadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
            >
              <div class="MuiCardContent-root css-15q2cw4">
                <div
                  style={{ color: "#000" }}
                  class="MuiTypography-root MuiTypography-h6 css-yp1y4z"
                >
                  Completed payouts
                </div>
                <div
                  style={{ color: "#000" }}
                  class="MuiTypography-root MuiTypography-h4 css-1c3irsm"
                >
                  2 398 369
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="MuiBox-root css-1vyvbmx">
        <div class="MuiBox-root css-1ertc2q">
          <div class="MuiBox-root css-1uzv6oc">
            <h3 class="MuiTypography-root MuiTypography-h4 css-ba8qdv">
              24/7 support
            </h3>
            <div class="MuiTypography-root MuiTypography-body1 css-1mwg2tm">
              Mila offers fast, reliable support whenever you need it. While
              our team is available to assist you around the clock, our active
              community also provides helpful advice and answers to questions.
              If you're wondering how to make money online, our platform and
              community will guide you every step of the way.
            </div>
          </div>
        </div>
        <div class="MuiBox-root css-1b5f23u">
          <img
            alt=""
            loading="lazy"
            width="1208"
            height="1208"
            decoding="async"
            data-nimg="1"
            style={{color:"transparent",width:"100%",height:"auto"}}
            sizes="100vw"
            src="https://jumptask.io/_next/image/?url=https%3A%2F%2Fwebassets-wordpress-prod.jumptask.io%2Fuploads%2F2024%2F11%2FIllustration-4.jpg&w=1920&q=95"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
