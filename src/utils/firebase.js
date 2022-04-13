import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
    doc,
    getDoc,
    getFirestore,
    query,
    where,
    collection,
    getDocs,
    collectionGroup,
} from "firebase/firestore";
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
    async getRegistrationStudent(userCol, teacherID, courseCol) {
        const teachersCourse = query(
            collection(this.db, "courses"),
            where("teacherUserID", "==", teacherID),
            where("status", "==", 0),
        );
        const querySnapshot = await getDocs(teachersCourse);
        const courseList = querySnapshot.docs.map(async doc => {
            const studentsCol = collection(
                this.db,
                "courses",
                doc.data().courseID,
                "students",
            );
            const query2Snapshot = await getDocs(studentsCol);

            return {
                title: doc.data().title,
                courseID: doc.data().courseID,
                studentsID: query2Snapshot.docs.map(
                    doc => doc.data().studentUserID,
                ),
            };
        });

        return courseList;
    },
};

export default firebaseInit;
