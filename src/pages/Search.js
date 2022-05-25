import React, { useState, useEffect } from "react";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { breakPoint } from "../utils/breakPoint";
import { useAlertModal } from "../customHooks/useAlertModal";
import PaginatedItems from "../Component/search/Paginate";
import SearchInput from "../Component/search/SearchInput";
import AlertModal from "../Component/common/AlertModal";
import { Loading } from "../Component/loading/Loading";
import { Footer } from "../Component/Footer";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;
    align-content: flex-start;
    min-height: calc(100vh - 100px);

    padding: 80px 10px 0 10px;

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
        max-width: 1200px;
        min-height: calc(100vh - 55px);
    }
`;

const InputDiv = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        width: 31%;
        padding-left: 15px;
    }
`;

const Search = () => {
    const q = new URLSearchParams(window.location.search).get("q");
    const [searchField, setSearchField] = useState(
        q === "latest" || q === "popular" || !q ? "" : q,
    );
    const [searchCourses, setSearchCourses] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();

    useEffect(() => {
        let isMounted = true;
        if (!q) navigate("/search?q=latest");
        setIsLoading(true);

        firebaseInit
            .getRegisteringCourse()
            .then(data => {
                let copyForOrderByCreatTimeData = [...data];
                const orderByCreatTime = copyForOrderByCreatTimeData.sort(
                    (a, b) => b.creatTime.seconds - a.creatTime.seconds,
                );

                const orderByView = data.sort((a, b) => b.view - a.view);

                if (isMounted) {
                    window.scrollTo({ top: 0 });
                    if (q === "latest") {
                        return setSearchCourses(orderByCreatTime);
                    }
                    if (q === "popular") return setSearchCourses(orderByView);
                    if (q) {
                        const filteredCourses = orderByCreatTime.filter(
                            data => {
                                return (
                                    data.title
                                        .toLowerCase()
                                        .includes(q.toLowerCase().trim()) ||
                                    data.courseIntroduction
                                        .toLowerCase()
                                        .includes(q.toLowerCase().trim())
                                );
                            },
                        );

                        if (filteredCourses.length === 0) {
                            handleAlertModal("暫無此類課程，提供您熱門課程！");
                            return navigate("/search?q=popular");
                        }
                        setSearchCourses(filteredCourses);
                    }
                }
            })
            .then(() => setIsLoading(false));

        return () => (isMounted = false);
    }, [q]);

    const handleChange = e => {
        e.preventDefault();
        if (!searchField.trim()) return;
        navigate(`/search?q=${searchField.trim()}`);
    };

    return (
        <>
            <Container>
                <InputDiv>
                    <SearchInput
                        searchField={searchField}
                        setSearchField={setSearchField}
                        changeValueCallback={e =>
                            setSearchField(e.target.value)
                        }
                        searchCallback={e => {
                            handleChange(e);
                        }}
                        placeholderText="今天想要學習什麼呢..."
                    />
                </InputDiv>
                {isLoading ? (
                    <Loading />
                ) : (
                    searchCourses && (
                        <PaginatedItems
                            itemsPerPage={6}
                            searchData={searchCourses}
                        />
                    )
                )}{" "}
            </Container>
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
            <Footer />
        </>
    );
};

export default Search;
