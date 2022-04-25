import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
`;

const Div13 = styled(Div1)`
    border: 1px solid black;
    width: 200px;
    height: auto;
    cursor: pointer;
    justify-content: flex-start;
`;

const DivContent = styled.div`
    padding-right: 20px;
    /* width: 100%; */
`;

export const CourseInfo = ({
    courseID,
    title,
    teacherName,
    creatDate,
    openingDate,
    view,
}) => {
    const navigate = useNavigate();
    return (
        <Div13
            onClick={() => {
                navigate(`/course?courseID=${courseID}`);
            }}
        >
            <DivContent>課程名稱: {title}</DivContent>
            <DivContent>老師: {teacherName}</DivContent>
            {creatDate && <DivContent>上架日期: {creatDate}</DivContent>}
            <DivContent>開課日期: {openingDate}</DivContent>
            {view && <DivContent>預覽人數: {view}</DivContent>}
        </Div13>
    );
};
