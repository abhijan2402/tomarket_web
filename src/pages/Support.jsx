import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Support = () => {
  const [types, setTypes] = useState([]);
//   const [sho]

  const collectionRef = collection(db, "supportSettings");

  useEffect(() => {
    const fetchTypes = async () => {
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTypes(data);
    };
    fetchTypes();
  }, []);

  return (
    <div style={{ marginTop: "50px", paddingLeft: 15, paddingRight: 15 }}>
      <h3 style={{ color: "#fff", fontSize: 30, marginBottom: 50 }}>
        What issue are you facing?
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {types?.map((item) => (
          <Link to={`/support/query?title=${item.type}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid gray",
              paddingBottom: 10,
              textDecoration: 'none'
            }}
            key={item.id}
          >
            <p style={{ color: "#fff", fontSize: 20 }}>{item.type}</p>

            <i
              style={{ color: "white", fontSize: 18 }}
              class="bi bi-chevron-right"
            ></i>
          </Link>
        ))}
      </div>


    
    </div>
  );
};

export default Support;
