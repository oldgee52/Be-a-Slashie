import React, { useState } from "react";
import styled from "styled-components";

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

const mockData = [
    {
        title: "課程1",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "1",
        courseIntroduction: "這是一堂有趣的課",
        teacherUserID: "55",
    },
    {
        title: "韓語課程",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "2",
        courseIntroduction: "這是一堂快速學習韓語的課",
        teacherUserID: "66",
    },
    {
        title: "JavaScript 入門課程",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "3",
        courseIntroduction: "這是一堂給踏入前端開發人員的第一步",
        teacherUserID: "77",
    },
    {
        title: "HTML CSS 進階",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "4",
        courseIntroduction: "這是一堂給有基礎的人",
        teacherUserID: "88",
    },
    {
        title: "課程5",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "5",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
];

export const Search = () => {
    const [searchField, setSearchField] = useState("");
    const [courses, setCourses] = useState();

    const handleChange = e => {
        e.preventDefault();
        if (!searchField.trim()) return;
        const filteredPersons = mockData.filter(data => {
            return (
                data.title
                    .toLowerCase()
                    .includes(searchField.toLowerCase().trim()) ||
                data.courseIntroduction
                    .toLowerCase()
                    .includes(searchField.toLowerCase().trim())
            );
        });
        if (filteredPersons.length === 0) return window.alert("查無資料");
        setCourses(filteredPersons);
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
                {courses &&
                    courses.map(course => (
                        <div key={course.courseID}>
                            <h2>{course.title}</h2>
                            <div>{course.courseIntroduction}</div>
                        </div>
                    ))}
            </SearchArea>
        </Container>
    );
};
