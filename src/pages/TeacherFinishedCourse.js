import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import breakPoint from "../utils/breakPoint";
import firebaseInit from "../utils/firebase";
import CourseInfo from "../Component/courses/CourseInfo";
import Loading from "../Component/loading/Loading";
import NoDataBox from "../Component/common/NoDataBox";
import { customDateDisplay } from "../utils/functions";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;

    @media ${breakPoint.desktop} {
        width: 80%;
        margin: auto;
        justify-content: flex-start;
        margin-left: 150px;
        margin-top: -150px;
    }
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 10px 0 10px;
    margin-bottom: 100px;
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

    @media ${breakPoint.desktop} {
        width: calc(30% - 10px);
        margin-right: 10px;
    }
`;

function TeacherFinishedCourse({ userID }) {
    const [finishedCourses, setFinishedCourses] = useState();

    useEffect(() => {
        let isMounted = true;

        if (userID) {
            firebaseInit.getTeachersStatusCourses(userID, 2).then(data => {
                const finishedCoursesRankByDate = data.sort(
                    (a, b) => b.closedDate.seconds - a.closedDate.seconds,
                );

                if (isMounted) setFinishedCourses(finishedCoursesRankByDate);
            });
        }

        return () => {
            isMounted = false;
        };
    }, [userID]);

    return !finishedCourses ? (
        <Loading />
    ) : (
        <Container>
            <CourseArea>
                {finishedCourses.length === 0 ? (
                    <NoDataBox
                        marginTop="35px"
                        marginLeft="100px"
                        title="???????????????????????????????????????????????????"
                        buttonWord="????????????"
                        path="/personal/teacher-upload-course"
                    />
                ) : (
                    finishedCourses.map(course => (
                        <CourseDiv key={course.courseID}>
                            <CourseInfo
                                image={course.image}
                                title={course.title}
                                openingDate={customDateDisplay(
                                    course.openingDate.seconds * 1000,
                                )}
                                closedDate={customDateDisplay(
                                    course.closedDate.seconds * 1000,
                                )}
                            />
                        </CourseDiv>
                    ))
                )}
            </CourseArea>
        </Container>
    );
}

TeacherFinishedCourse.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default TeacherFinishedCourse;
