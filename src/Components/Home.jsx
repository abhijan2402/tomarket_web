import React, { useEffect, useState } from "react";
import "../Style/Home.css";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import SkeletonList from "../Components/SkeletonList/SkeletonList";

const Home = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("home data", homeData);

  const getHomeData = async () => {
    setLoading(true);
    let resultArray = [];
    const data = query(collection(db, "layouts"));
    const querySnapshot = await getDocs(data);
    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });
    setHomeData(resultArray);
    setLoading(false);
  };

  useEffect(() => {
    getHomeData();
  }, []);

  if (loading) {
    return <SkeletonList />;
  }

  return (
    <>
      <div className="home_container">
        {homeData.map((item, index) => {
          return (
            <>
              <div className="main_img_container" key={index}>
                <img src={item.main_image} alt="Loading......!!" />
              </div>

              <div className="home_content_contatiner">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div
                className="home_redirection_btn"
                onClick={() => navigate("task")}
              >
                <span style={{ color: "goldenrod" }}>Let’s Get Started</span> –
                Create Your First Task!{" "}
                <i class="bi bi-box-arrow-in-up-right"></i>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default Home;
