import React, { useState, useEffect } from "react";
import PaginatedItems from "../Component/Paginate";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "../Component/SearchInput";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;

const SearchArea = styled.div`
    width: 100%;
`;

export const Search = () => {
    const q = new URLSearchParams(window.location.search).get("q");
    const [searchField, setSearchField] = useState(
        q === "latest" || q === "popular" || !q ? "" : q,
    );

    const [searchCourses, setSearchCourses] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        firebaseInit.getRegisteringCourse().then(data => {
            console.log(data);
            let copyForOrderByCreatTimeData = [...data];
            const orderByCreatTime = copyForOrderByCreatTimeData.sort(
                (a, b) => b.creatTime.seconds - a.creatTime.seconds,
            );
            console.log("排序時間", orderByCreatTime);

            const orderByView = data.sort((a, b) => b.view - a.view);
            console.log("排序次數", orderByView);

            if (isMounted) {
                if (q === "latest") return setSearchCourses(orderByCreatTime);
                if (q === "popular") return setSearchCourses(orderByView);
                if (q) {
                    const filteredCourses = orderByCreatTime.filter(data => {
                        return (
                            data.title
                                .toLowerCase()
                                .includes(q.toLowerCase().trim()) ||
                            data.courseIntroduction
                                .toLowerCase()
                                .includes(q.toLowerCase().trim())
                        );
                    });
                    console.log(filteredCourses);
                    if (filteredCourses.length === 0) {
                        setSearchCourses();
                        return window.alert("查無資料");
                    }
                    setSearchCourses(filteredCourses);
                }
            }
        });

        return () => (isMounted = false);
    }, [q]);

    const handleChange = () => {
        if (!searchField.trim()) return;
        navigate(`/search?q=${searchField.trim()}`);
    };

    return (
        <Container>
            <SearchArea>
                <SearchInput
                    searchField={searchField}
                    changeValueCallback={e => setSearchField(e.target.value)}
                    searchCallback={() => {
                        handleChange();
                    }}
                />
            </SearchArea>
            {searchCourses && (
                <PaginatedItems itemsPerPage={2} searchData={searchCourses} />
            )}
        </Container>
    );
};
