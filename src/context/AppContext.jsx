import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [mySingleStasks, setMySingleTasks] = useState([]);

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

  useEffect(() => {
    fetchCategories();
    fetchMySingleTasks();
  }, []);

  return (
    <AppContext.Provider value={{ categories, mySingleStasks, setMySingleTasks }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
