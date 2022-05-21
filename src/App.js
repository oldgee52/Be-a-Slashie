import React, { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { TeacherUpload } from "./pages/TeacherUpload";
import { Course } from "./pages/Course";
import { TeacherConfirmRegistration } from "./pages/TeacherConfirmRegistration";
import { TeacherOpeningCourse } from "./pages/TeacherOpeningCourse";
import { StudentOpeningCourse } from "./pages/StudentOpeningCourse";
import Header from "./Component/Header";
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
import { Login } from "./pages/Login";
import { Personal } from "./Component/Personal";
import RequireAuth from "./Component/RequireAuth";
import { ModalProvider } from "styled-react-modal";
import { FinishedRegisteredCourse } from "./pages/FinishedRegisteredCourse";
import { NotFound } from "./pages/NotFound";

function App() {
    const [userID, setUserID] = useState("");
    const [userLogin, setUserLogin] = useState("check");

    useEffect(() => {
        firebaseInit.listenToAuthStatus(user => {
            if (user) {
                setUserLogin("in");
                setUserID(user.uid);
                return;
            }
            setUserLogin("out");
        });
    }, [userID]);
    return (
        <>
            <GlobalStyle />
            <ModalProvider>
                <BrowserRouter>
                    <Header userID={userID} />

                    <Routes>
                        <Route
                            path="personal"
                            element={
                                <RequireAuth userLogin={userLogin}>
                                    <Personal />
                                </RequireAuth>
                            }
                        >
                            <Route
                                path="student-got-skill"
                                element={<StudentGotSkill userID={userID} />}
                            />
                            <Route
                                path="student-collection-course"
                                element={
                                    <StudentCollectionCourse userID={userID} />
                                }
                            />
                            <Route
                                path="student-finished-course"
                                element={
                                    <StudentFinishedCourse userID={userID} />
                                }
                            />
                            <Route
                                path="student-registered-course"
                                element={
                                    <StudentRegisteredCourse userID={userID} />
                                }
                            />
                            <Route
                                path="student-opening-course"
                                element={
                                    <StudentOpeningCourse userID={userID} />
                                }
                            />

                            <Route
                                path="profile"
                                element={<Profile userID={userID} />}
                            />
                            <Route
                                path="teacher-finished-course"
                                element={
                                    <TeacherFinishedCourse userID={userID} />
                                }
                            />

                            <Route
                                path="teacher-confirm-registration"
                                element={
                                    <TeacherConfirmRegistration
                                        userID={userID}
                                    />
                                }
                            />
                            <Route
                                path="teacher-upload-course"
                                element={<TeacherUpload userID={userID} />}
                            />
                            <Route
                                path="teacher-opening-course"
                                element={
                                    <TeacherOpeningCourse userID={userID} />
                                }
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

                        <Route
                            path="course"
                            element={
                                <RequireAuth userLogin={userLogin}>
                                    <Course userID={userID} />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="login"
                            element={
                                <Login userID={userID} userLogin={userLogin} />
                            }
                        />
                        <Route
                            path="talented-person-search"
                            element={<TalentedPersonSearch />}
                        />
                        <Route
                            path="personal-introduction"
                            element={<PersonalIntroduction />}
                        />
                        <Route
                            path="finished-registered-course/:courseID"
                            element={<FinishedRegisteredCourse />}
                        />

                        {/* <Route path="course" element={<Course />} /> */}
                        <Route path="search" element={<Search />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ModalProvider>
        </>
    );
}

export default App;
