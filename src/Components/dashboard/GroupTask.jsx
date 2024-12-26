import React, { useEffect, useState } from "react";
import "../../Style/Dashboard.css";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase";
import SkeletonList from "../SkeletonList/SkeletonList";
import { useAuth } from "../../context/AuthContext";
import { platformIcons } from "../../constant/icons";
import { useQuery } from "@tanstack/react-query";
import GroupTaskSkeleton from "../SkeletonList/GroupTaskSkeleton";

const fetchTasks = async (userUid) => {
  const q = query(
    collection(db, "tasks"),
    where("status", "==", "approved"),
    where("createdBy", "!=", userUid),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const tasks = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return tasks;
};

function GroupTask() {
  const { user } = useAuth();
  const [selectedGroupTasks, setSelectedGroupTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (tasks, taskId) => {
    setSelectedGroupTasks(tasks);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroupTasks([]);
  };

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["group-tasks", user.uid],
    queryFn: () => fetchTasks(user.uid),
    staleTime: 300000,
  });


  return (
    <>
      <div className="advert-container ">
        {isLoading ? (
          <GroupTaskSkeleton />
        ) : (
          tasks?.length > 0 &&
          tasks?.map((group, index) => {
            if (
              !group.tasks ||
              !Array.isArray(group.tasks) ||
              group.tasks.length === 0
            ) {
              return null;
            }
            const firstTask = group.tasks[0];
            return (
              <div
                className="advert-space card m-2 p-3"
                key={group.id || index}
              >
                <div className="advert_space_img">
                  <i
                    className={`bi ${
                      platformIcons[firstTask.platformLogo?.toLowerCase()] ||
                      platformIcons.defaultIcon
                    }`}
                  ></i>
                </div>
                <div className="advert_space_details card-body">
                  <h5 className="card-title fs-4">
                    {firstTask?.title || "Untitled Task"}
                  </h5>
                  <p className="text-success fs-5">{`+${
                    firstTask?.reward || 0
                  } $`}</p>
                </div>
                <div className="advert_space_btn  d-flex justify-content-between align-items-center">
                  <button
                    className="advert_space_btn1"
                    onClick={() => handleOpenModal(group.tasks, group?.id)}
                  >
                    Open
                  </button>
                  <p className="advert_space_card_count mb-0">{`${group?.tasks.length}`}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div
          className="modal fade show custom-modal"
          style={{
            display: "block",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content modal-tsk-content">
              <div className="modal-header">
                <h5 className="modal-title">Group Tasks</h5>
                <i
                  className="bi bi-x-square"
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  onClick={handleCloseModal}
                ></i>
              </div>
              <div className="modal-body">
                {selectedGroupTasks.map((task, index) => {
                  return (
                    <div className="mb-2" key={index}>
                      <div className="custome-card">
                        <div className="grp-tsk-desc">
                          <h6
                            className="card-title fs-5"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                marginRight: "14px",
                                display: "flex",
                              }}
                            >
                              <i
                                className={`bi ${
                                  platformIcons[
                                    task.platformLogo?.toLowerCase()
                                  ] || platformIcons.defaultIcon
                                }`}
                              ></i>
                            </span>
                            {task?.title || "Untitled Task"}
                          </h6>
                          <p className="text-success fs-6 pt-1">
                            +{task?.reward || 0} $
                          </p>
                        </div>
                        <div>
                          {/* {showAddProof ? (
                                <button
                                  className="redirect-icon"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  Proof
                                  <i
                                    className="bi bi-upload"
                                    style={{
                                      fontSize: "14px",
                                      color: "#000",
                                      marginLeft: "8px",
                                    }}
                                  ></i>
                                </button>
                              ) : (
                                <button
                                  className={`redirect-icon ${
                                    task.status === "completed"
                                      ? "disabled"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleCompleteTask(groupTaskId, task.link)
                                  }
                                  disabled={task.status === "completed"}
                                  style={{
                                    cursor:
                                      task.status === "completed"
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                >
                                  {task.status === "completed" ? (
                                    <i
                                      className="bi bi-check2-all"
                                      style={{
                                        fontSize: "20px",
                                        color: "#000",
                                      }}
                                    ></i>
                                  ) : (
                                    "Start"
                                  )}
                                </button>
                              )} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupTask;
