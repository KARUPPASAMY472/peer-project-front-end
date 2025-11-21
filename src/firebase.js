import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-LOPOLBs2tovHzJnbFGXUgXKOe_fn1vE",
  authDomain: "peer-project-f8c5a.firebaseapp.com",
  projectId: "peer-project-f8c5a",
  storageBucket: "peer-project-f8c5a.firebasestorage.app",
  messagingSenderId: "696864648594",
  appId: "1:696864648594:web:058c72c60d8a734151e54b",
  measurementId: "G-KZ41JK9V15"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
