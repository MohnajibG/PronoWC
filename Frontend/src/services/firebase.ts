import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDM1r7-zj-_rWDpVUTaXhqldvhhBTYx5QU",
  authDomain: "pronowc.firebaseapp.com",
  projectId: "pronowc",
  storageBucket: "pronowc.firebasestorage.app",
  messagingSenderId: "27890855102",
  appId: "1:27890855102:web:b389f914a5d433c51182ef",
  measurementId: "G-G4GMFKCND3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
