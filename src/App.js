import { LandingPage } from "./Component/LandingPage";
import { Search } from "./Component/Search";
import { TeacherUpload } from "./pages/TeacherUpload";
import PaginatedItems from "./Component/Paginate";
import { Course } from "./pages/Course";
import { TeacherConfirmRegistration } from "./pages/TeacherConfirmRegistration";
import { TeacherOpeningCourse } from "./pages/TeacherOpeningCourse";
import GlobalStyle from "./globalStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    <Route
                        path="teacherOpeningCourse"
                        element={<TeacherOpeningCourse />}
                    />
                    <Route
                        path="teacherConfirmRegistration"
                        element={<TeacherConfirmRegistration />}
                    />
                    <Route path="course" element={<Course />} />
                    <Route path="teacherUpload" element={<TeacherUpload />} />
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
