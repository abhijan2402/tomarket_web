import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDX8_dmdNNdTcfmzXgHa29I2Fhg3zV7U1Q",
    authDomain: "tomarket-6a3e1.firebaseapp.com",
    projectId: "tomarket-6a3e1",
    storageBucket: "tomarket-6a3e1.appspot.com",
    messagingSenderId: "1038626066547",
    appId: "1:1038626066547:web:32f4ddf17fe6297f841a06"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);