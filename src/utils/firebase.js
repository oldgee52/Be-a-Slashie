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
    async getRegistrationStudent(teacherID) {
        const teachersCourse = query(
            collection(this.db, "courses"),
            where("teacherUserID", "==", teacherID),
            where("status", "==", 0),
        );
        const teachersCourseSnapshot = await getDocs(teachersCourse);
        const courseList = teachersCourseSnapshot.docs.map(async course => {
            const studentsCol = collection(
                this.db,
                "courses",
                course.data().courseID,
                "students",
            );
            const studentsSnapshot = await getDocs(studentsCol);

            const studentsID = studentsSnapshot.docs.map(
                student => student.data().studentUserID,
            );

            const studentID = studentsID.map(async id => {
                const studentsNameSnap = await getDoc(
                    doc(this.db, "users", id),
                );
                const studentData = studentsNameSnap.data();

                return {
                    name: studentData.name,
                    studentID: studentData.uid,
                };
            });

            let students;
            await Promise.all(studentID).then(value => {
                students = value;
            });

            return {
                title: course.data().title,
                courseID: course.data().courseID,
                students,
            };
        });

        let p = Promise.all(courseList);

        return p;
    },
};

export default firebaseInit;
