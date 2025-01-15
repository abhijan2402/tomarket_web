import React, { useEffect, useState } from "react";
import "../../Style/Dashboard.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { platformIcons } from "../../constant/icons";
import { useQuery } from "@tanstack/react-query";
import GroupTaskSkeleton from "../SkeletonList/GroupTaskSkeleton";
import ProofModal from "./ProofModal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

  console.log(tasks);
  return tasks;
};

function GroupTask() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState();
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState({});
  const [proofBtnLoading, setProofBtnLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [proofLink, setProofLink] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [taskIndex, setTaskIndex] = useState(null);

  const handleOpenModal = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const openProofModal = (task, index) => {
    setSelectedTask(task);
    setTaskIndex(index);
    setProofModalOpen(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroup({});
  };

  function areAllTasksEligible(groupTask) {
    return groupTask.tasks.every((task) => {
      // Tasks with "screenshot" or "link" proof require at least one approved user task for the logged-in user
      if (task.proof === "screenshot" || task.proof === "link") {
        return task.userTasks.some(
          (userTask) =>
            userTask.userId === user.uid &&
            (userTask.status === "approved" || userTask.status === "claimed")
        );
      } else {
        return task.userTasks.some(
          (userTask) =>
            userTask.userId === user.uid &&
            (userTask.status === "started" || userTask.status === "claimed")
        );
      }

      // Tasks with other proof types are always eligible
      return false;
    });
  }

  const handleClaimTask = async (group, index) => {

   const isEligibe = areAllTasksEligible(group)

    if(!isEligibe) {
     return alert('Please complete all task to get reward')
    }

    setBtnLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const taskDocRef = doc(db, "tasks", group.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const data = taskDoc.data();

      const existingUserTasks = data?.tasks[index].userTasks || [];
      const userTaskIndex = existingUserTasks.findIndex(
        (task) => task.userId === user.uid
      );

      if (userTaskIndex === -1) {
        toast.error("User task not found.");
        return;
      }

      existingUserTasks[userTaskIndex].status = "claimed";
      existingUserTasks[userTaskIndex].timestamp = new Date();

      const updatedTasks = data.tasks.map((task, idx) =>
        idx === taskIndex ? { ...task, userTasks: existingUserTasks } : task
      );

      await updateDoc(taskDocRef, { tasks: updatedTasks });

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === group.id ? { ...item, tasks: updatedTasks } : item
        )
      );

      setSelectedGroup({ ...selectedGroup, tasks: updatedTasks });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wallet: increment(Number(group?.tasks[index].reward)),
      });

      toast.success("Reward claimed successfully!");
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    } finally {
      setBtnLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleStartTask = async (taskId, index, link) => {
    window.open(link, "_blank");

    setBtnLoading((prev) => ({ ...prev, [index]: true }));

    try {
      console.log(taskId);
      const taskDocRef = doc(db, "tasks", taskId);
      const taskDoc = await getDoc(taskDocRef);

      let existingUserTasks = [];

      const data = taskDoc.data();

      if (taskDoc.exists()) {
        existingUserTasks = data?.tasks[index]?.userTasks || [];
      }

      const newUserTask = {
        userId: user.uid,
        userName: user.name,
        status: "started",
        proofUrl: "",
        timestamp: new Date(),
      };

      const updatedUserTasks = [...existingUserTasks, newUserTask];

      const updatedTasks = data.tasks.map((task, idx) =>
        idx === index ? { ...task, userTasks: updatedUserTasks } : task
      );

      await updateDoc(taskDocRef, { tasks: updatedTasks });

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === taskId ? { ...item, tasks: updatedTasks } : item
        )
      );

      setSelectedGroup({ ...selectedGroup, tasks: updatedTasks });

      toast.info("Task is completed and tracked.");
    } catch (error) {
      toast.error("Failed to process the task.");
      console.error(error);
    } finally {
      setBtnLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const submitProof = async () => {
    if (!selectedTask) {
      toast.error("Invalid proof data.");
      return;
    }

    setProofBtnLoading(true);

    try {
      const taskDocRef = doc(db, "tasks", selectedGroup.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const data = taskDoc.data();

      const existingUserTasks = data?.tasks[taskIndex].userTasks || [];
      const userTaskIndex = existingUserTasks.findIndex(
        (task) => task.userId === user.uid
      );

      if (userTaskIndex === -1) {
        toast.error("User task not found.");
        return;
      }

      const updateTaskProof = async (proofUrl) => {
        existingUserTasks[userTaskIndex].proofUrl = proofUrl;
        existingUserTasks[userTaskIndex].status = "submitted";
        existingUserTasks[userTaskIndex].timestamp = new Date();

        const updatedTasks = data.tasks.map((task, idx) =>
          idx === taskIndex ? { ...task, userTasks: existingUserTasks } : task
        );

        await updateDoc(taskDocRef, { tasks: updatedTasks });

        setTasks((prevTasks) =>
          prevTasks.map((item) =>
            item.id === selectedGroup.id
              ? { ...item, tasks: updatedTasks }
              : item
          )
        );

        setSelectedGroup({ ...selectedGroup, tasks: updatedTasks });
        toast.success("Proof submitted successfully!");
        setProofModalOpen(false);
      };

      if (data?.tasks[taskIndex].proof === "link") {
        await updateTaskProof(proofLink);
      } else if (data?.tasks[taskIndex].proof === "screenshot") {
        if (proofFile && proofFile.type.startsWith("image/")) {
          const proofRef = ref(
            storage,
            `proofs/${selectedGroup.id}/${proofFile.name}-${Date.now()}`
          );
          const uploadResult = await uploadBytes(proofRef, proofFile);
          const proofURL = await getDownloadURL(uploadResult.ref);
          await updateTaskProof(proofURL);
        } else {
          toast.error("Invalid proof file.");
        }
      } else {
        toast.error("Proof is not required.");
      }
    } catch (error) {
      toast.error("Failed to submit proof.");
      console.error(error);
    } finally {
      setProofBtnLoading(false);
    }
  };

  const handleProofFileChange = (event) => {
    setProofFile(event.target.files[0]);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["group-tasks", user.uid],
    queryFn: () => fetchTasks(user.uid),
    staleTime: 300000,
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  return (
    <>
      <div className="advert-container">
        {isLoading ? (
          <GroupTaskSkeleton />
        ) : (
          tasks?.length > 0 &&
          tasks?.map((group, index) => {
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
                    onClick={() => handleOpenModal(group)}
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

              <div></div>
              <div className="modal-body">
                <div>
                  {selectedGroup?.thumbnail ? (
                    <div>
                      <img
                        style={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                        src={selectedGroup?.thumbnail}
                      />
                    </div>
                  ) : null}

                  <p style={{ marginTop: "10px", textAlign: "left" }}>
                    {selectedGroup?.description}
                  </p>
                </div>

                <hr />
                {selectedGroup?.tasks?.map((task, index) => {
                  const userTask = task.userTasks?.find(
                    (task) => task.userId === user.uid
                  );

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
                                marginRight: "10px",
                                display: "flex",
                              }}
                            >
                              {task.platformLogo.toLowerCase() === "twitter" ||
                              task.platformLogo.toLowerCase() === "facebook" ||
                              task.platformLogo.toLowerCase() === "instagram" ||
                              task.platformLogo.toLowerCase() === "reddit" ||
                              task.platformLogo.toLowerCase() === "youtube" ? (
                                <i
                                  className={`bi ${
                                    platformIcons[
                                      task.platformLogo?.toLowerCase()
                                    ] || platformIcons.defaultIcon
                                  }`}
                                ></i>
                              ) : (
                                <img
                                  style={{
                                    width: 45,
                                    height: 45,
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                  src={task.platformLogo}
                                  alt=""
                                />
                              )}
                            </span>
                            {task?.title || "Untitled Task"}
                          </h6>
                          <p
                            className="text-success fs-6 pt-1"
                            style={{ textAlign: "left", paddingLeft: "30px" }}
                          >
                            +{task?.reward || 0} $
                          </p>
                        </div>

                        <div>
                          {userTask?.status === "started" ? (
                            task.proof === "screenshot" ||
                            task.proof === "link" ? (
                              <button
                                disabled={proofBtnLoading}
                                className="redirect-icon"
                                onClick={() => openProofModal(task, index)}
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
                                disabled={btnLoading[index]}
                                className={`start-redirect-icon`}
                                onClick={() =>
                                  handleClaimTask(selectedGroup, index)
                                }
                                style={{
                                  color: "#fff",
                                  textWrap: "nowrap",
                                  paddingLeft: 15,
                                  paddingRight: 15,
                                }}
                              >
                                {btnLoading[index] ? (
                                  <div
                                    class="spinner-border text-light spinner-border-sm"
                                    role="status"
                                  ></div>
                                ) : (
                                  <>
                                    Claim
                                    <i
                                      className="bi bi-currency-dollar"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    ></i>
                                  </>
                                )}
                              </button>
                            )
                          ) : userTask?.status === "submitted" ? (
                            <div
                              className={`start-redirect-icon`}
                              style={{
                                textWrap: "nowrap",
                                opacity: "0.8",
                                cursor: "not-allowed",
                              }}
                            >
                              Under Review
                            </div>
                          ) : userTask?.status === "approved" ? (
                            <button
                              disabled={btnLoading[index]}
                              className={`start-redirect-icon`}
                              onClick={() =>
                                handleClaimTask(selectedGroup, index)
                              }
                              style={{
                                color: "#fff",
                                textWrap: "nowrap",
                                paddingLeft: 15,
                                paddingRight: 15,
                              }}
                            >
                              {btnLoading[index] ? (
                                <div
                                  class="spinner-border text-light spinner-border-sm"
                                  role="status"
                                ></div>
                              ) : (
                                <>
                                  Claim
                                  <i
                                    className="bi bi-currency-dollar"
                                    style={{
                                      fontSize: "16px",
                                    }}
                                  ></i>
                                </>
                              )}
                            </button>
                          ) : userTask?.status === "claimed" ? (
                            <a
                              href={task.link}
                              target="_blank"
                              className={`start-redirect-icon disabled`}
                              style={{
                                cursor: "not-allowed",
                                borderRadius: "10px",
                                padding: "4px 10px",
                                backgroundColor: "transparent",
                                color: "#fff",
                              }}
                            >
                              <i
                                class="bi bi-check2-circle"
                                style={{ fontSize: "20px" }}
                              ></i>
                            </a>
                          ) : (
                            <button
                              disabled={btnLoading[index]}
                              className={`start-redirect-icon`}
                              onClick={() => {
                                handleStartTask(
                                  selectedGroup.id,
                                  index,
                                  task.link
                                );
                              }}
                            >
                              {btnLoading[index] ? (
                                <div
                                  class="spinner-border text-light spinner-border-sm"
                                  role="status"
                                ></div>
                              ) : (
                                "Start"
                              )}
                            </button>
                          )}
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

      <ProofModal
        proofModalOpen={proofModalOpen}
        setProofModalOpen={setProofModalOpen}
        setProofLink={setProofLink}
        selectedTask={selectedTask}
        btnLoading={proofBtnLoading}
        submitProof={submitProof}
        handleProofFileChange={handleProofFileChange}
      />
    </>
  );
}

export default GroupTask;
