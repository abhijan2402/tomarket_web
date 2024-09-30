import { addDoc, collection } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function Reward() {
  const AddTask = async () => {
    try {
      const DataResp = await addDoc(collection(db, "tasks"), {
        title: "Hello",
        description: "Comment on you tube",
        reward: 5,
        link: "https://youtu.be/KAJFALcJjac?si=PEqQLtislJflqy35",
        type: "Social Media",
        createdAt: new Date(),
        createdBy: "User",
        status: "Pendign Approval",
      });
      console.log(DataResp, "RESP");
      alert("Task added");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
    }
  };
  return (
    <div>
      <h1>Reward</h1>
      <button onClick={AddTask} style={{ marginTop: "10px" }}>
        Click Me
      </button>
    </div>
  );
}

export default Reward;
