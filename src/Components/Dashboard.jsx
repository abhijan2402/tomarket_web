import React, { useContext, useEffect, useState } from "react";
import "../Style/Dashboard.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import Card from "./Cards/Card";
import SkeletonList from "./SkeletonList/SkeletonList";
import { AppContext } from "../context/AppContext";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("New");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [singleTasks, setSingleTasks] = useState([]);
  const [multiTasks, setMultiTasks] = useState([]);
  const [taskStates, setTaskStates] = useState({});
  const [loading, setLoading] = useState(true);
  const { categories } = useContext(AppContext);

  const handleCompleteTask = (taskId, youtubeLink) => {
    window.open(youtubeLink, "_blank");
    setCompletedTasks([...completedTasks, taskId]);
  };

  const getSingleTasks = async () => {
    setLoading(true);
    let resultArray = [];
    const q = query(collection(db, "singletasks"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });

    console.log(resultArray);

    setSingleTasks(resultArray);
    setLoading(false);
  };

  const getMultiTasks = async () => {
    setLoading(true);
    let resultArray = [];
    const q = query(collection(db, "tasks"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });

    console.log(resultArray);

    setMultiTasks(resultArray);
    setLoading(false);
  };

  console.log(multiTasks);

  useEffect(() => {
    getSingleTasks();
    getMultiTasks();
  }, []);

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);

  const handleStartClick = (taskId, link) => {
    handleCompleteTask(taskId, link);
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: { loading: true, claimed: false },
    }));

    setTimeout(() => {
      setTaskStates((prev) => ({
        ...prev,
        [taskId]: { loading: false, claimed: true },
      }));
    }, 3000);
  };

  const renderTasks = () => {
    let filteredTasks = [];
    if (activeTab === "New") {
      filteredTasks = singleTasks.filter((task) => task.status === "approved");
    } else if (activeTab === "OnChain") {
      filteredTasks = singleTasks.filter(
        (task) => task.status === "approved" && task.category === "OnChain"
      );
    } else if (activeTab === "Socials") {
      filteredTasks = singleTasks.filter(
        (task) => task.category === "Socials" && task.status === "approved"
      );
    }

    return (
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className="task-list-item">
            <i className="bi bi-youtube"></i>
            <div className="task-details">
              <h4 className="task-title">
                {/* {task.title.length > 20
                  ? `${task.title.substring(0, 20)}...`
                  : task.title} */}
                {task.title}
              </h4>
              <div style={{ display: "flex", gap: "5px" }}>
                {/* <p
                  className="task-time"
                  style={{ color: "red", fontSize: "12px" }}
                >
                  +{task.reward} BP
                </p> */}
                <p
                  className="task-time"
                  style={{ color: "green", fontSize: "12px" }}
                >
                  +{task.reward} BP
                </p>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => handleStartClick(task.id, task.link)}
                disabled={isTaskCompleted(task.id)}
                className={`redirect-icon ${
                  isTaskCompleted(task.id) ? "task-completed" : ""
                } ${taskStates[task.id]?.claimed ? "claim-button" : ""}`}
                style={{
                  backgroundColor: taskStates[task.id]?.loading
                    ? "grey"
                    : taskStates[task.id]?.claimed
                    ? "greenyellow"
                    : "#fcc419",
                }}
              >
                {taskStates[task.id]?.loading ? (
                  <div className="spinner"></div>
                ) : taskStates[task.id]?.claimed ? (
                  "Claim"
                ) : isTaskCompleted(task.id) ? (
                  "Task Completed"
                ) : (
                  "Start"
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderMultiTasks = () => {
    return (
      <div className="advert-container">
        {multiTasks
          ?.filter((task) => task.status === "approved")
          .map((item) => (
            <div className="advert-space" key={item.id}>
              <div className="advert_space_img">
                <img
                  src="https://www.iconeasy.com/icon/png/Application/Adobe%20CS5/ai.png"
                  alt="img"
                />
              </div>
              <div className="advert_space_details">
                <h5>{item?.tasks[0].title}</h5>
                <p style={{ color: "green" }}>+{item?.tasks[0].reward} BP</p>
              </div>
              <div className="advert_space_btn">
                <button className="advert_space_btn1">Open</button>
                <p className="advert_space_card_count">
                  0/{item?.tasks?.length || 0}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderWeeklyTasks = () => {
    return multiTasks?.filter(
      (task) => task.status === "approved" && task.category === "Weekly"
    )?.length ? (
      <div>
        <h3 className="card_title ">Weekly</h3>
        <div className="weekly-task">
          {multiTasks
            ?.filter(
              (task) => task.status === "approved" && task.category === "Weekly"
            )
            .map((item) => (
              <Card key={item?.id} card_data={item} />
            ))}
        </div>
      </div>
    ) : null;
  };



  return (
    <div className="dashboard-container">
      {renderMultiTasks()}

      {renderWeeklyTasks()}

      <div className="tabs-container">
        {categories?.map((category) => (
          <button
            className={activeTab === category.name ? "active" : ""}
            onClick={() => setActiveTab(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="task-container">
        {loading ? <SkeletonList /> : renderTasks()}
      </div>
    </div>
  );
}

export default Dashboard;
