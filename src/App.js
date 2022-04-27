import React, { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { TeacherUpload } from "./pages/TeacherUpload";
import { Course } from "./pages/Course";
import { TeacherConfirmRegistration } from "./pages/TeacherConfirmRegistration";
import { TeacherOpeningCourse } from "./pages/TeacherOpeningCourse";
import { StudentOpeningCourse } from "./pages/StudentOpeningCourse";
import Sidebar from "./Component/Sidebar";
import { Profile } from "./pages/Profile";
import { StudentRegisteredCourse } from "./pages/StudentRegisteredCourse";
import { StudentFinishedCourse } from "./pages/StudentFinishedCourse";
import { TeacherFinishedCourse } from "./pages/TeacherFinishedCourse";
import { StudentCollectionCourse } from "./pages/StudentCollectionCourse";
import { StudentGotSkill } from "./pages/StudentGotSkill";
import { TalentedPersonSearch } from "./pages/TalentedPersonSearch";
import { PersonalIntroduction } from "./pages/PersonalIntroduction";
import { WishingWell } from "./pages/WishingWell";
import firebaseInit from "./utils/firebase";
import GlobalStyle from "./globalStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Login } from "./pages/Login";
import { Personal } from "./Component/Personal";
import RequireAuth from "./Component/RequireAuth";

function App() {
    const [userID, setUserID] = useState("");
    const [userLogin, setUserLogin] = useState("check");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseInit.auth, user => {
            if (user) {
                setUserLogin("in");
                setUserID(user.uid);
                console.log(user.uid);
            } else {
                setUserLogin("out");
                setUserID("");
            }
        });

        return unsubscribe;
    }, [userID]);
    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Sidebar userID={userID} />

                <Routes>
                    <Route
                        path="personal"
                        element={
                            <RequireAuth userLogin={userLogin}>
                                <Personal userID={userID} />
                            </RequireAuth>
                        }
                    >
                        <Route
                            path="student-got-skill"
                            element={<StudentGotSkill />}
                        />
                        <Route
                            path="student-collection-course"
                            element={<StudentCollectionCourse />}
                        />
                        <Route
                            path="student-finished-course"
                            element={<StudentFinishedCourse />}
                        />
                        <Route
                            path="student-registered-course"
                            element={<StudentRegisteredCourse />}
                        />
                        <Route
                            path="student-opening-course"
                            element={<StudentOpeningCourse />}
                        />

                        <Route path="profile" element={<Profile />} />
                        <Route
                            path="teacher-finished-course"
                            element={<TeacherFinishedCourse />}
                        />

                        <Route
                            path="teacher-confirm-registration"
                            element={<TeacherConfirmRegistration />}
                        />
                        <Route
                            path="teacher-upload-course"
                            element={<TeacherUpload />}
                        />
                        <Route
                            path="teacher-opening-course"
                            element={<TeacherOpeningCourse />}
                        />
                    </Route>
                    <Route
                        path="wishing-well"
                        element={
                            <RequireAuth userLogin={userLogin}>
                                <WishingWell userID={userID} />
                            </RequireAuth>
                        }
                    />

                    <Route path="login" element={<Login />} />
                    <Route
                        path="talented-person-search"
                        element={<TalentedPersonSearch />}
                    />
                    <Route
                        path="personal-introduction"
                        element={<PersonalIntroduction />}
                    />

                    <Route path="course" element={<Course />} />
                    <Route path="search" element={<Search />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
