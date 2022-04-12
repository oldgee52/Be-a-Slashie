import React, { useState, useEffect } from "react";
import PaginatedItems from "./Paginate";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

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

const InputArea = styled.input`
    width: 100%;
`;

const Button = styled.button`
    width: 100%;
`;

export const Search = () => {
    const [searchField, setSearchField] = useState("");
    const [allCourses, setAllCourses] = useState();
    const [searchCourses, setSearchCourses] = useState();

    useEffect(() => {
        (async function (db) {
            const coursesCol = collection(db, "courses");
            const isRegistrationCourse = query(
                coursesCol,
                where("registrationDeadline", ">=", new Date()),
                orderBy("registrationDeadline", "asc"),
            );
            const coursesSnapshot = await getDocs(isRegistrationCourse);
            const courseList = coursesSnapshot.docs.map(doc => doc.data());
            setAllCourses(courseList);
            console.log(courseList);
        })(firebaseInit.db);
    }, []);

    const handleChange = e => {
        e.preventDefault();
        if (!searchField.trim()) return;

        const filteredCourses = allCourses.filter(data => {
            return (
                data.title
                    .toLowerCase()
                    .includes(searchField.toLowerCase().trim()) ||
                data.courseIntroduction
                    .toLowerCase()
                    .includes(searchField.toLowerCase().trim())
            );
        });
        console.log(filteredCourses);
        if (filteredCourses.length === 0) return window.alert("查無資料");
        setSearchCourses(filteredCourses);
    };

    const orderByCreatDate = e => {
        e.preventDefault();
        const reOrderByCreatDateAllCourses = allCourses.sort(function (a, b) {
            return b.creatTime - a.creatTime;
        });
        setSearchCourses(reOrderByCreatDateAllCourses);
    };

    const orderByView = e => {
        e.preventDefault();
        const reOrderByViewAllCourses = allCourses.sort(function (a, b) {
            return b.view - a.view;
        });
        setSearchCourses(reOrderByViewAllCourses);
    };

    return (
        <Container>
            <SearchArea>
                <InputArea
                    type="search"
                    placeholder="Search"
                    value={searchField}
                    onChange={e => {
                        setSearchField(e.target.value);
                    }}
                />
                <Button onClick={handleChange}>送出</Button>
                <Button onClick={orderByCreatDate}>依上架日期</Button>
                <Button onClick={orderByView}>依熱門程度</Button>
                {searchCourses && (
                    <PaginatedItems itemsPerPage={1} courses={searchCourses} />
                )}
            </SearchArea>
        </Container>
    );
};
