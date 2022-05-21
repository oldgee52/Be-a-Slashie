import { initializeApp } from "firebase/app";
import {
    doc,
    getDoc,
    getFirestore,
    query,
    where,
    collection,
    getDocs,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    updateDoc,
    arrayRemove,
    arrayUnion,
    onSnapshot,
    setDoc,
    increment,
    addDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

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
    auth: getAuth(),
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
    async getTeachersStatusCourses(teacherID, status) {
        const teachersCourseSnapshot = await this.getTeachersCourses(
            teacherID,
            status,
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

            const courseData = course.data();

            return {
                title: courseData.title,
                image: courseData.image,
                courseID: courseData.courseID,
                getSkills: courseData.getSkills,
                openingDate: courseData.openingDate,
                closedDate: courseData?.closedDate || "",
                students,
                homework: teacherSnapshot.data()?.homework || [],
                materials: teacherSnapshot.data()?.materials || [],
            };
        });

        const courseListData = await Promise.all(courseList);

        return courseListData;
    },
    async getStudentCourse(studentID, status) {
        const studentDoc = doc(this.db, "users", studentID);
        const studentSnapShot = await getDoc(studentDoc);

        const studentCourse = studentSnapShot.data().studentsCourses || [];

        const courseDataPromise = studentCourse.map(async course => {
            const courseDoc = await getDoc(doc(this.db, "courses", course));
            return courseDoc.data();
        });

        const courseData = await Promise.all(courseDataPromise);

        const userStatusCourse = courseData.filter(
            course => course.status === status,
        );

        return userStatusCourse;
    },

    async getStudentOpeningCourseDetails(studentID, status) {
        const courseData = await this.getStudentCourse(studentID, status);
        const courseDetailsPromise = courseData.map(async detail => {
            const courseStudentsDetail = await getDoc(
                doc(this.db, "courses", detail.courseID, "students", studentID),
            );

            const courseTeacherDetail = await getDoc(
                doc(this.db, "courses", detail.courseID, "teacher", "info"),
            );
            const teacherInfo = await getDoc(
                doc(this.db, "users", detail.teacherUserID),
            );

            const courseTeacherDetailData = courseTeacherDetail.data();
            const courseStudentsDetailData = courseStudentsDetail.data();
            const teacherInfoData = teacherInfo.data();

            return {
                title: detail.title,
                teacherUserID: detail.teacherUserID,
                teacherName: teacherInfoData.name,
                allHomework: courseTeacherDetailData?.homework || [],
                materials: courseTeacherDetailData?.materials || [],
                courseID: detail.courseID,
                myHomework: courseStudentsDetailData?.homework || [],
                registrationStatus: courseStudentsDetailData.registrationStatus,
                getSkills: detail.getSkills,
            };
        });

        const courseDetails = await Promise.all(courseDetailsPromise);
        const userOpeningCourseDetails = courseDetails.filter(
            detail => detail.registrationStatus === 1,
        );

        return userOpeningCourseDetails;
    },
    async getCourseDetail(courseID) {
        const courseData = await this.getCollectionData("courses", courseID);
        const teacherData = await this.getCollectionData(
            "users",
            courseData.teacherUserID,
        );
        return {
            ...courseData,
            teacherData,
        };
    },
    async getCollectionData(col, id) {
        const userDataSnapShop = await getDoc(doc(this.db, col, id));
        return userDataSnapShop.data();
    },
    async getCollection(colRef) {
        const collectionSnapshot = await getDocs(colRef);
        const data = collectionSnapshot.docs.map(doc => doc.data());

        return data;
    },
    async getSkillsInfo() {
        const skillsInfo = await this.getCollection(
            collection(this.db, "skills"),
        );
        return skillsInfo;
    },
    async getStudentAllCourse(studentID) {
        const studentDoc = doc(this.db, "users", studentID);
        const studentSnapShot = await getDoc(studentDoc);

        const studentCourse = studentSnapShot.data().studentsCourses || [];

        const courseDataPromise = studentCourse.map(async course => {
            const courseDoc = await getDoc(doc(this.db, "courses", course));
            return courseDoc.data();
        });

        const courseData = await Promise.all(courseDataPromise);

        return courseData;
    },

    async getStudentRegisteredCourseDetails(studentID) {
        const courseData = await this.getStudentAllCourse(studentID);
        const courseDetailsPromise = courseData.map(async detail => {
            const courseStudentsDetail = await getDoc(
                doc(this.db, "courses", detail.courseID, "students", studentID),
            );

            const teacherInfo = await getDoc(
                doc(this.db, "users", detail.teacherUserID),
            );

            const courseStudentsDetailData = courseStudentsDetail.data();
            const teacherInfoData = teacherInfo.data();

            return {
                title: detail.title,
                image: detail.image,
                teacherUserID: detail.teacherUserID,
                teacherName: teacherInfoData.name,
                teacherEmail: teacherInfoData.email,
                teacherPhoto: teacherInfoData.photo,
                courseOpeningDate: detail.openingDate,
                courseClosedDate: detail?.closedDate || "",
                courseRegistrationDeadline: detail.registrationDeadline,
                courseID: detail.courseID,
                courseStatus: detail.status,
                registrationStatus: courseStudentsDetailData.registrationStatus,
            };
        });

        const registeredCourseDetails = await Promise.all(courseDetailsPromise);

        return registeredCourseDetails;
    },

    async getStudentCollectCourses(studentID) {
        const studentData = await this.getCollectionData("users", studentID);

        const StudentCollectionCourses = studentData.collectCourses || [];
        const coursesDataPromise = StudentCollectionCourses.map(
            async course => {
                const courseData = await this.getCollectionData(
                    "courses",
                    course,
                );
                return courseData;
            },
        );
        const coursesData = Promise.all(coursesDataPromise);
        return coursesData;
    },

    async getStudentSkills(studentID) {
        const studentSkills = await this.getCollection(
            collection(this.db, "users", studentID, "getSkills"),
        );

        const skillDataPromise = studentSkills.map(async studentSkill => {
            const skillsDate = await this.getCollectionData(
                "skills",
                studentSkill.skillID,
            );

            return {
                ...studentSkill,
                image: skillsDate.image,
                title: skillsDate.title,
            };
        });

        const studentSkillsData = Promise.all(skillDataPromise);

        return studentSkillsData;
    },

    async getUsersInfoIncludeSkill() {
        const allUsersData = await this.getCollection(
            collection(firebaseInit.db, "users"),
        );
        const getSkillsPromise = allUsersData.map(async user => {
            const skills = await this.getStudentSkills(user.uid);
            const filterRepeatSkill = skills.filter(
                (skill, index, self) =>
                    index === self.findIndex(t => t.skillID === skill.skillID),
            );

            return {
                ...user,
                skills: filterRepeatSkill,
            };
        });

        const userInfoData = Promise.all(getSkillsPromise);

        return userInfoData;
    },
    async getFirstBatchWishes() {
        const q = query(
            collection(this.db, "wishingWells"),
            orderBy("creatDate", "desc"),
            limit(14),
        );
        const firstWishesSnapshot = await getDocs(q);
        const wishes = firstWishesSnapshot.docs.map(wish => {
            return wish.data();
        });

        const lastKey =
            firstWishesSnapshot.docs[firstWishesSnapshot.docs.length - 1];

        return { wishes, lastKey };
    },
    async getNextBatchWishes(key) {
        const q = query(
            collection(this.db, "wishingWells"),
            orderBy("creatDate", "desc"),
            startAfter(key),
            limit(6),
        );
        const nextWishesSnapshot = await getDocs(q);
        const wishes = nextWishesSnapshot.docs.map(wish => {
            return wish.data();
        });
        const lastKey =
            nextWishesSnapshot.docs[nextWishesSnapshot.docs.length - 1];

        return { wishes, lastKey };
    },
    async getRegisteringCourse() {
        const q = query(
            collection(this.db, "courses"),
            where("registrationDeadline", ">=", Timestamp.now()),
            where("status", "==", 0),
        );

        const courseSnapshot = await getDocs(q);
        const course = courseSnapshot.docs.map(course => course.data());
        const courseWithTeacherInfo = course.map(async item => {
            const teacherInfo = await this.getCollectionData(
                "users",
                item.teacherUserID,
            );

            return {
                ...item,
                teacherInfo,
            };
        });

        const data = Promise.all(courseWithTeacherInfo);
        return data;
    },
    listenToCourseData(courseID, callback) {
        onSnapshot(doc(this.db, "courses", courseID), snapshot => {
            const courseDate = snapshot.data();
            callback(courseDate);
        });
    },
    listenToAuthStatus(callback) {
        onAuthStateChanged(this.auth, user => {
            callback(user);
        });
    },
    updateDocForUserCollection(userID, courseID, userCollection) {
        updateDoc(doc(this.db, "users", userID), {
            collectCourses: userCollection
                ? arrayRemove(courseID)
                : arrayUnion(courseID),
        });
    },
    setDocToStudentRegisterCourse(courseID, userID, teacherUserID) {
        setDoc(doc(this.db, "courses", courseID, "students", userID), {
            teacherUserID,
            courseID,
            studentUserID: userID,
            registrationStatus: 0,
        });
    },
    updateDocForUserStudentsCourses(userID, courseID) {
        updateDoc(doc(this.db, "users", userID), {
            studentsCourses: arrayUnion(courseID),
        });
    },
    updateDocForCourseRegistrationNumber(courseID) {
        updateDoc(doc(this.db, "courses", courseID), {
            registrationNumber: increment(1),
        });
    },
    updateDocForCourseAddView(courseID) {
        updateDoc(doc(this.db, "courses", courseID), {
            view: increment(1),
        });
    },
    async handleEmailSingUp(email, password, name) {
        const userCredential = await createUserWithEmailAndPassword(
            this.auth,
            email,
            password,
        );
        const uid = userCredential.user.uid;
        setDoc(doc(this.db, "users", uid), {
            email,
            uid,
            name,
            photo: "https://firebasestorage.googleapis.com/v0/b/be-a-slashie.appspot.com/o/photo-C%3A%5Cfakepath%5Cprofile.png?alt=media&token=7bfb27e7-5b32-454c-8182-446383794d95",
            selfIntroduction: "成為斜槓人生的路上，有你我相伴。",
        });
    },
    async handleSingInWithEmail(email, password) {
        await signInWithEmailAndPassword(this.auth, email, password);
    },
    async handleSingOut() {
        await signOut(this.auth);
    },
    async handleProfileInfoChange(modifyContent, inputFields, userID) {
        const modifyData = {
            [`${modifyContent}`]: inputFields[modifyContent],
        };
        await updateDoc(doc(this.db, "users", userID), modifyData);
    },
    async setDocForMakeWish(content, userID) {
        const coursesRef = collection(this.db, "wishingWells");
        const docRef = doc(coursesRef);
        const id = docRef.id;
        const data = {
            content,
            creatDate: Timestamp.now(),
            userID,
            id,
        };
        await setDoc(docRef, data);
        return data;
    },
    async updateDocForHandleWishLike(wishId, userID, condition) {
        await updateDoc(doc(this.db, "wishingWells", wishId), {
            like: condition ? arrayRemove(userID) : arrayUnion(userID),
        });
    },
    async updateDocForTeacherAddHomework(courseID, homeworkTitle) {
        const data = {
            title: homeworkTitle,
            creatDate: Timestamp.now(),
        };

        await updateDoc(doc(this.db, "courses", courseID, "teacher", "info"), {
            homework: arrayUnion(data),
        });

        return data;
    },
    async updateDocForTeacherFinishCourse(courseID) {
        updateDoc(doc(this.db, "courses", courseID), {
            status: 2,
            closedDate: Timestamp.now(),
        });
    },
    async addDocForHandleStudentsGetSkills(CourseArray) {
        CourseArray.getSkills.forEach(skill => {
            CourseArray.students.forEach(student => {
                const studentID = student.studentID;
                const getSkillsStatus = student.getSkillsStatus;
                if (getSkillsStatus === 1)
                    addDoc(
                        collection(this.db, "users", studentID, "getSkills"),
                        {
                            getDate: Timestamp.now(),
                            skillID: skill,
                            userID: studentID,
                        },
                    );
            });
        });
    },
    async updateDocForTeacherOpeningCourse(courseID) {
        await updateDoc(doc(this.db, "courses", courseID), {
            status: 1,
        });
    },
    async updateDocForStudentsCourseRegistrationStatus(CourseArray, courseID) {
        CourseArray.forEach(element => {
            element.students.forEach(async student => {
                const studentID = student.studentID;
                const registrationStatus = student.registrationStatus;
                await updateDoc(
                    doc(this.db, "courses", courseID, "students", studentID),
                    {
                        registrationStatus,
                    },
                );
            });
        });
    },
    async updateDocForReplyMessage(courseArray, index, inputFields, userID) {
        const stateCopy = JSON.parse(JSON.stringify(courseArray));
        stateCopy.askedQuestions.forEach((question, i) => {
            if (i === index) {
                question.replies.push({
                    repliedContent: inputFields[index].reply,
                    repliedDate: Timestamp.now(),
                    repliedUserID: userID,
                });
            }
        });

        await updateDoc(doc(this.db, "courses", courseArray.courseID), {
            askedQuestions: stateCopy.askedQuestions,
        });
    },
    async updateDocForSendMessage(courseID, message, userID) {
        await updateDoc(doc(this.db, "courses", courseID), {
            askedQuestions: arrayUnion({
                askedContent: message,
                askedDate: Timestamp.now(),
                askedUserID: userID,
                replies: [],
            }),
        });
    },
};

export default firebaseInit;
