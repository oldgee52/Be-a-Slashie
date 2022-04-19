import { LandingPage } from "./Component/LandingPage";
import { Search } from "./Component/Search";
import { TeacherUpload } from "./pages/TeacherUpload";
import PaginatedItems from "./Component/Paginate";
import { Course } from "./pages/Course";
import { TeacherConfirmRegistration } from "./pages/TeacherConfirmRegistration";
import { TeacherOpeningCourse } from "./pages/TeacherOpeningCourse";
import { StudentOpeningCourse } from "./pages/StudentOpeningCourse";
import Sidebar from "./Component/Sidebar";
import { Profile } from "./pages/Profile";
import { StudentRegisteredCourse } from "./pages/StudentRegisteredCourse";
import { StudentClosedCourse } from "./pages/StudentClosedCourse";
import GlobalStyle from "./globalStyles";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Sidebar />
                <Routes>
                    <Route
                        path="Student-closed-course"
                        element={<StudentClosedCourse />}
                    />
                    <Route
                        path="student-registered-course"
                        element={<StudentRegisteredCourse />}
                    />
                    <Route path="profile" element={<Profile />} />
                    <Route
                        path="student-opening-course"
                        element={<StudentOpeningCourse />}
                    />
                    <Route
                        path="teacher-opening-course"
                        element={<TeacherOpeningCourse />}
                    />
                    <Route
                        path="teacher-confirm-registration"
                        element={<TeacherConfirmRegistration />}
                    />
                    <Route path="course" element={<Course />} />
                    <Route
                        path="teacher-upload-course"
                        element={<TeacherUpload />}
                    />
                    <Route path="search" element={<Search />} />
                    <Route
                        path="/paginate"
                        element={<PaginatedItems itemsPerPage={2} />}
                    />
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
