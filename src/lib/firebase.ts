import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVQgGOaxWFLzt-YRDb6zHXa80n03h0Elw",
  authDomain: "hariswarup-connect.firebaseapp.com",
  projectId: "hariswarup-connect",
  storageBucket: "hariswarup-connect.firebasestorage.app",
  messagingSenderId: "554017292243",
  appId: "1:554017292243:web:528bbafd0044fafd74f926",
  measurementId: "G-N0NKB59EDK",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
