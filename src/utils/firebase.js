import { initializeApp } from "firebase/app";
import {
    doc,
    getDoc,
    getFirestore,
    query,
    where,
    collection,
    getDocs,
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
    async getTeachersCourses(teacherID, state) {
        const teachersCourse = query(
            collection(this.db, "courses"),
            where("teacherUserID", "==", teacherID),
            where("status", "==", state),
        );
        const teachersCourseSnapshot = await getDocs(teachersCourse);
        return teachersCourseSnapshot;
    },
    async getRegistrationStudent(teacherID) {
        const teachersCourseSnapshot = await this.getTeachersCourses(
            teacherID,
            0,
        );
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

            const studentsData = studentsID.map(async id => {
                const studentsNameSnap = await getDoc(
                    doc(this.db, "users", id),
                );
                const studentData = studentsNameSnap.data();

                return {
                    name: studentData.name,
                    studentID: studentData.uid,
                    email: studentData.email,
                    registrationStatus: 0,
                };
            });

            let students;
            await Promise.all(studentsData).then(value => {
                students = value;
            });

            return {
                title: course.data().title,
                courseID: course.data().courseID,
                students,
            };
        });

        const courseListData = await Promise.all(courseList);

        return courseListData;
    },
    async getOpeningCorses(teacherID) {
        const teachersCourseSnapshot = await this.getTeachersCourses(
            teacherID,
            1,
        );
        const courseList = teachersCourseSnapshot.docs.map(async course => {
            const studentsCol = query(
                collection(
                    this.db,
                    "courses",
                    course.data().courseID,
                    "students",
                ),
                where("registrationStatus", "==", 1),
            );
            const studentsSnapshot = await getDocs(studentsCol);

            const studentsID = studentsSnapshot.docs.map(
                student => student.data().studentUserID,
            );

            const studentsData = studentsID.map(async id => {
                const studentsSnap = await getDoc(doc(this.db, "users", id));
                const studentData = studentsSnap.data();

                const studentsHomeworkSnap = await getDoc(
                    doc(
                        this.db,
                        "courses",
                        course.data().courseID,
                        "students",
                        id,
                    ),
                );
                const studentsHomework = studentsHomeworkSnap.data();

                return {
                    name: studentData.name,
                    studentID: studentData.uid,
                    email: studentData.email,
                    studentsHomework: studentsHomework.homework || [],
                };
            });

            let students;
            await Promise.all(studentsData).then(value => {
                students = value;
            });

            const teacherCol = doc(
                firebaseInit.db,
                "courses",
                course.data().courseID,
                "teacher",
                "info",
            );

            const teacherSnapshot = await getDoc(teacherCol);
            // const courseData = teacherSnapshot.docs.map(doc => doc.data());
            console.log(teacherSnapshot.data());

            return {
                title: course.data().title,
                courseID: course.data().courseID,
                students,
                homework: teacherSnapshot.data()?.homework || [],
                materials: teacherSnapshot.data()?.materials || [],
            };
        });

        const courseListData = await Promise.all(courseList);

        return courseListData;
    },
};

export default firebaseInit;
