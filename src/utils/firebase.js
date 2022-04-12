import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCJUou9zUfb6A9XJTQgohPz5PPdMvZxybA",
    authDomain: "be-a-slashie.firebaseapp.com",
    projectId: "be-a-slashie",
    databaseURL: "gs://be-a-slashie.appspot.com/",
    storageBucket: "be-a-slashie.appspot.com",
    messagingSenderId: "864276173343",
    appId: "1:864276173343:web:9ce02ae3b8a0381af4bb2a",
    measurementId: "G-CPFD9775F1",
};

const app = initializeApp(firebaseConfig);

const firebaseInit = {
    db: getFirestore(app),
    storage: getStorage(app),
};

export default firebaseInit;
