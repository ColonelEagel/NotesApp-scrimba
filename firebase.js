// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection  } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDDoO2tRtuLzigVFGL5JDBTBkTvdQUtdp8",
    authDomain: "notesapp-scrimba.firebaseapp.com",
    projectId: "notesapp-scrimba",
    storageBucket: "notesapp-scrimba.appspot.com",
    messagingSenderId: "1083534554800",
    appId: "1:1083534554800:web:2bd41ed79bf18494c0ed75",
    measurementId: "G-VKZY5K2XBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db =getFirestore(app)//to get the cloud firestore only 
const notesCollection=collection(db,'notes')    //to get the notes collection and pass the cloud firestore to it
const analytics = getAnalytics(app);

export {notesCollection}