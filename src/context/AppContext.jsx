import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [mySingleStasks, setMySingleTasks] = useState([]);
  const [myGrouptasks, setMyGroupTasks] = useState([]);

  const [joiningAmount, setJoiningAmount] = useState();
  const [refferalPoint, setRefferalPoint] = useState();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const joiningAmount = await getDoc(
          doc(db, "settings", "joiningAmount")
        );

        setJoiningAmount(Number(joiningAmount.data().value || 0));

        const referralPoint = await getDoc(
          doc(db, "settings", "referralPoint")
        );

        setRefferalPoint(Number(referralPoint.data().value || 0));
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchContent();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categories.sort((a, b) => a.position - b.position));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMySingleTasks = async () => {
    try {
      const q = query(
        collection(db, "singletasks"),
        where("createdBy", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(tasks);
      setMySingleTasks(tasks);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyGroupTasks = async () => {
    console.log("object");
    try {
      const q = query(
        collection(db, "tasks"),
        where("createdBy", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(tasks);
      setMyGroupTasks(tasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMySingleTasks();
    fetchMyGroupTasks();
  }, []);

  return (
    <AppContext.Provider
      value={{
        categories,
        mySingleStasks,
        setMySingleTasks,
        setMyGroupTasks,
        myGrouptasks,
        refferalPoint,
        joiningAmount
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
