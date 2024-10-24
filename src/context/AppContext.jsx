import { collection, getDocs } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../firebase";

export const AppContext = createContext();

function AppProvider({ children }) {
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AppContext.Provider value={{ categories }}>{children}</AppContext.Provider>
  );
}

export default AppProvider;
