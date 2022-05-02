import React from "react";
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
    border-bottom: 2px solid black;

    background-color: whitesmoke;

    cursor: ${props => (props.isLink ? "pointer" : "default")};

    @media ${breakPoint.desktop} {
        flex-direction: column;
        align-items: center;
        border: 2px solid black;
        padding: 0;
        padding-bottom: 20px;
        border-radius: 5px;
        border-bottom: 10px solid black;
    }
`;

const CourseImg = styled.img`
    width: 100px;
    height: 80px;
    flex-shrink: 0;
    object-fit: cover;
    @media ${breakPoint.desktop} {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
`;
const CourseTitle = styled.div`
    flex: 1 0 auto;
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        width: 85%;
        order: 0;
        padding: 0;
    }
`;

const CourseName = styled.h4`
    width: 60vw;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    word-wrap: break-word;

    margin-bottom: 10px;

    @media ${breakPoint.desktop} {
        width: 100%;
        font-size: 24px;
        padding-top: 40px;
        height: 120px;
        word-wrap: break-word;
        overflow: hidden;
    }
`;

const TeacherName = styled.p`
    color: #7f7f7f;
    font-size: 14px;
    line-height: 20px;
    margin-top: 5px;

    @media ${breakPoint.desktop} {
        font-size: 18px;
        margin-top: 10px;
    }
`;

const View = styled.p`
    flex-shrink: 0;
    font-size: 12px;
    @media ${breakPoint.desktop} {
        align-self: flex-end;
        font-size: 16px;
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

// const Label = styled.div`
//     display: none;
//     @media ${breakPoint.desktop} {
//         display: block;
//         position: absolute;
//         width: 120px;
//         height: 30px;
//         line-height: 30px;

//         text-align: center;

//         z-index: 2;
//         background-color: black;
//         color: white;
//         right: -30px;
//         top: 12px;

//         transform: rotate(45deg);
//     }
// `;

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
}) => {
    const navigate = useNavigate();
    return (
        <>
            {/* <TeacherPhoto src={image} alt={title}></TeacherPhoto> */}
            <CourseCard
                onClick={() => {
                    if (courseID) navigate(`/course?courseID=${courseID}`);
                }}
                isLink={courseID}
            >
                {/* <Label>New</Label> */}
                {teacherPhoto && (
                    <TeacherPhoto
                        src={teacherPhoto}
                        alt={teacherName}
                    ></TeacherPhoto>
                )}
                <CourseImg src={image} alt={title} />
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
                {view && (
                    <View>
                        <FiEye viewBox="0 -3 24 24 " /> {view}
                    </View>
                )}
            </CourseCard>
        </>
    );
};
