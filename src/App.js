import { LandingPage } from "./Component/LandingPage";
import { Search } from "./Component/Search";
import GlobalStyle from "./globalStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    <Route path="search" element={<Search />} />
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
