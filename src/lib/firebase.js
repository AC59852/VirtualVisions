import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbOi7m6ZKsZGhWuS45ER1DfLi0qlFOXd8",
  authDomain: "virtual-visions.firebaseapp.com",
  databaseURL: "https://virtual-visions-default-rtdb.firebaseio.com",
  projectId: "virtual-visions",
  storageBucket: "virtual-visions.appspot.com",
  messagingSenderId: "185788174437",
  appId: "1:185788174437:web:219033cd474f54d442768c",
  measurementId: "G-JM1K8S2HRN"
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const storage = getStorage(app);