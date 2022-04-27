import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

const CourseCard = styled.div`
    width: 100%;
    display: flex;

    justify-content: center;
    margin-top: 10px;

    padding-bottom: 20px;
    border-bottom: 2px solid black;
`;

const CourseImg = styled.img`
    width: 100px;
    height: auto;
    flex-shrink: 0;
    /* padding-bottom: 20%; */
`;
const CourseTitle = styled.div`
    flex: 1 0 auto;
    padding-left: 10px;
`;

const CourseName = styled.h4`
    width: 60vw;
    font-size: 20px;
    font-weight: 700;

    margin-bottom: 10px;
    word-break: break-all;
`;

const TeacherName = styled.p`
    color: #7f7f7f;
    font-size: 14px;
    line-height: 20px;
    margin-top: 5px;
`;

const View = styled.p`
    flex-shrink: 0;
    font-size: 12px;
`;

export const CourseInfo = ({
    courseID,
    title,
    teacherName,
    creatDate,
    openingDate,
    view,
    image,
}) => {
    const navigate = useNavigate();
    return (
        <CourseCard
            onClick={() => {
                navigate(`/course?courseID=${courseID}`);
            }}
        >
            <CourseImg src={image} />
            <CourseTitle>
                <CourseName>{title}</CourseName>
                <TeacherName>{teacherName}</TeacherName>
                <TeacherName>上架日期 {creatDate}</TeacherName>
                <TeacherName>開課日期 {openingDate}</TeacherName>
            </CourseTitle>

            <View>
                <FiEye viewBox="0 -3 24 24 " /> {view}
            </View>
        </CourseCard>
    );
};
