import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAidLUmCX2kQJlWDZXCMEJOoDgerXP4H7w",
  authDomain: "cartransport-pro-704d3.firebaseapp.com",
  projectId: "cartransport-pro-704d3",
  storageBucket: "cartransport-pro-704d3.firebasestorage.app",
  messagingSenderId: "273001055930",
  appId: "1:273001055930:web:22ace001fde490b9e7e483"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);



