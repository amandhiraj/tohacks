import firebase from 'firebase';
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyC5CrIGP9_R9pQOwrQeDOusIFFuGnTAczc",
    authDomain: "tohackslogin.firebaseapp.com",
    projectId: "tohackslogin",
    storageBucket: "tohackslogin.appspot.com",
    messagingSenderId: "6799261443",
    appId: "1:6799261443:web:34d539252ea1d62acbb336",
    measurementId: "G-1SV569CV3H"
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;