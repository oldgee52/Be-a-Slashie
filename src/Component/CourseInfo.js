import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { breakPoint } from "../utils/breakPoint";

const CourseCard = styled.div`
    width: 100%;
    display: flex;

    justify-content: center;
    margin-top: 10px;

    padding: 10px;

    padding-bottom: 20px;
    border-bottom: 5px solid #ff6700;

    background-color: whitesmoke;

    box-shadow: rgb(0 0 0 / 24%) 0px 4px 4px 0px;
    border-radius: 5px;

    cursor: ${props => (props.isLink ? "pointer" : "default")};

    @media ${breakPoint.desktop} {
        flex-direction: column;
        align-items: center;
        padding: 0;
        padding-bottom: 20px;

        border-bottom: 10px solid #ff6700;
    }
`;
const ImgBox = styled.div`
    width: 100px;
    height: 80px;
    @media ${breakPoint.desktop} {
        width: 100%;
        height: 200px;

        overflow: hidden;
    }
`;

const CourseImg = styled.img`
    width: 100px;
    height: 80px;
    object-fit: cover;

    @media ${breakPoint.desktop} {
        width: 100%;
        height: 200px;
        object-fit: cover;
        overflow: hidden;
        transform: ${props => (props.mouseEnter ? "scale(1.2)" : "scale(1)")};
        transition: transform 0.28s ease-in-out;
    }
`;
const CourseTitle = styled.div`
    width: calc(100% - 100px);
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        width: 85%;
        order: 0;
        padding: 0;
    }
`;

const CourseName = styled.h4`
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    height: 72px;
    overflow: hidden;
    word-wrap: break-word;

    margin-bottom: 10px;

    @media ${breakPoint.desktop} {
        width: 100%;
        font-size: 24px;
        padding-top: 40px;
        height: 130px;
    }
`;

const TeacherName = styled.p`
    color: #7f7f7f;
    font-size: 16px;
    line-height: 20px;
    margin-top: 5px;

    @media ${breakPoint.desktop} {
        font-size: 18px;
        margin-top: 10px;
    }
`;

const View = styled.p`
    font-size: 12px;
    width: 50px;
    text-align: right;
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    @media ${breakPoint.desktop} {
        align-self: flex-end;
        margin-top: -20px;
        margin-right: 30px;
    }
`;

const TeacherPhoto = styled.img`
    display: none;
    @media ${breakPoint.desktop} {
        display: block;
        position: absolute;
        width: 70px;
        height: 70px;
        border-radius: 100%;
        border: 3px solid whitesmoke;
        object-fit: cover;
        z-index: 2;

        top: -30px;
        left: 10px;
    }
`;

const ViewSpan = styled.span`
    margin-left: 5px;
`;

const Label = styled.div`
    display: none;
    @media ${breakPoint.desktop} {
        display: block;
        position: absolute;
        width: 120px;
        height: 30px;
        line-height: 30px;

        text-align: center;

        z-index: 2;
        background-color: #ff6100;
        color: whitesmoke;
        letter-spacing: 5px;
        right: -30px;
        top: 12px;
        transform: rotate(45deg);
    }
`;

export const CourseInfo = ({
    courseID,
    title,
    teacherName,
    creatDate,
    openingDate,
    view,
    image,
    teacherPhoto,
    closedDate,
    label,
}) => {
    const [isMouseEnter, setIsMouseEnter] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            <CourseCard
                onClick={() => {
                    if (courseID) navigate(`/course?courseID=${courseID}`);
                }}
                isLink={courseID}
                onMouseEnter={() => {
                    setIsMouseEnter(true);
                }}
                onMouseLeave={() => {
                    setIsMouseEnter(false);
                }}
            >
                {teacherPhoto && (
                    <TeacherPhoto
                        src={teacherPhoto}
                        alt={teacherName}
                    ></TeacherPhoto>
                )}
                <ImgBox>
                    {label && <Label>{label}</Label>}
                    <CourseImg
                        alt={title}
                        src={image}
                        mouseEnter={isMouseEnter}
                    />
                </ImgBox>
                <CourseTitle>
                    <CourseName>{title}</CourseName>
                    <TeacherName>{teacherName}</TeacherName>
                    {creatDate && (
                        <TeacherName>上架日期 {creatDate}</TeacherName>
                    )}
                    {openingDate && (
                        <TeacherName>開課日期 {openingDate}</TeacherName>
                    )}
                    {closedDate && (
                        <TeacherName>完課日期 {closedDate}</TeacherName>
                    )}
                </CourseTitle>
                {view === undefined ? (
                    ""
                ) : (
                    <View>
                        <FiEye viewBox="0 -3 24 24 " />
                        <ViewSpan>{view}</ViewSpan>
                    </View>
                )}
            </CourseCard>
        </>
    );
};
