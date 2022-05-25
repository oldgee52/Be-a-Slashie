import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import PropTypes from "prop-types";
import { breakPoint } from "../utils/breakPoint";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import CourseInfo from "../Component/courses/CourseInfo";
import NoDataTitle from "../Component/common/NoDataTitle";
import { Loading } from "../Component/loading/Loading";
import { customDateDisplay } from "../utils/functions";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;
    padding: 0 10px;

    @media ${breakPoint.desktop} {
        width: 100%;
        justify-content: space-between;
        margin: auto;
        margin-left: 150px;
        margin-top: -135px;
        padding: 0;
    }
`;

const CourseTitle = styled.h3`
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    line-height: 1.2;
    width: 100%;
    cursor: pointer;

    word-break: break-all;

    @media ${breakPoint.desktop} {
        width: 90%;
        font-size: 22px;
    }
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden;
    max-height: ${props => (props.show ? "1500px" : "0")};
    transition: ${props =>
        props.show ? "max-height 1s ease-out" : "max-height 0.3s ease-in"};

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
        align-items: flex-start;
        &::after {
            content: "";
            width: calc(30% - 10px);
        }
    }
`;

const CourseDiv = styled.div`
    width: 100%;
    overflow: hidden;

    @media ${breakPoint.desktop} {
        width: calc(30% - 10px);
        margin-right: 10px;
        margin-bottom: 20px;
    }
`;

const StudentRegisteredCourse = ({ userID }) => {
    const [registeredCourse, setRegisteredCourse] = useState();
    const [isShow, setIsShow] = useState([true, false, false]);

    useEffect(() => {
        let isMounted = true;

        if (userID)
            firebaseInit
                .getStudentRegisteredCourseDetails(userID)
                .then(data => {
                    if (isMounted) setRegisteredCourse(data);
                });

        return () => (isMounted = false);
    }, [userID]);

    function handleIsShow(i) {
        let data = [...isShow];
        data[i] = !data[i];
        setIsShow(data);
    }

    function renderCourses(status) {
        const showCourses = registeredCourse
            .filter(item => item.registrationStatus === status)
            .sort(
                (a, b) =>
                    b.courseOpeningDate.seconds - a.courseOpeningDate.seconds,
            );

        return showCourses.length === 0 ? (
            <CourseDiv>
                <NoDataTitle title="無" />
            </CourseDiv>
        ) : (
            showCourses?.map(course => (
                <CourseDiv key={course.courseID}>
                    <CourseInfo
                        teacherPhoto={course.photo}
                        image={course.image}
                        title={course.title}
                        teacherName={course.teacherName}
                        openingDate={customDateDisplay(
                            course.courseOpeningDate.seconds * 1000,
                        )}
                    />
                </CourseDiv>
            ))
        );
    }

    return (
        <>
            {!registeredCourse ? (
                <Loading />
            ) : (
                <Container>
                    <CourseTitle onClick={() => handleIsShow(0)}>
                        {isShow[0] ? (
                            <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                        ) : (
                            <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                        )}{" "}
                        審核中
                    </CourseTitle>
                    <CourseArea show={isShow[0]}>{renderCourses(0)}</CourseArea>

                    <CourseTitle onClick={() => handleIsShow(1)}>
                        {isShow[1] ? (
                            <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                        ) : (
                            <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                        )}{" "}
                        已同意
                    </CourseTitle>
                    <CourseArea show={isShow[1]}>{renderCourses(1)}</CourseArea>

                    <CourseTitle onClick={() => handleIsShow(2)}>
                        {isShow[2] ? (
                            <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                        ) : (
                            <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                        )}{" "}
                        未同意
                    </CourseTitle>
                    <CourseArea show={isShow[2]}>{renderCourses(2)}</CourseArea>
                </Container>
            )}
        </>
    );
};

StudentRegisteredCourse.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default StudentRegisteredCourse;
