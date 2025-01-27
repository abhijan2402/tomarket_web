import React, { useEffect, useState } from "react";
import "../Style/HowItsWork.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const HowItsWork = () => {

  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getDoc(
          doc(db, "settings", "howReferralWorks")
        );

        setContent(data.data().value)
      } catch (error) {
        console.error("Error fetching settings:", error);
        
      }
    }

    fetchContent()
  }, []);
  

  return (
    <div>
      <div class="section titles">
        <div class="container titles w-container">
          <div class="wrapper-heading">
            <h1 class="heading-large _20-ch">
              Tomarket Referral <br /> System
            </h1>
            <div class="p-small-size text-white-opacity">December 28, 2024</div>
          </div>
        </div>
      </div>

      <div>
        <div class="container padding-bottom-medium w-container">
          <div class="wrapper-full-image rounded margin-bottom-small">
            <img
              src="https://cdn.prod.website-files.com/65b6a1a4a0e2af577bcccede/677023aedfe581142759802b_reffffka.png"
              loading="lazy"
              alt=""
              class="full-image"
            />
          </div>
          <div dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
      </div>
    </div>
  );
};

export default HowItsWork;
