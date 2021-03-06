import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebaseInit from "../utils/firebase";
import breakPoint from "../utils/breakPoint";
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
        margin-top: -130px;
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
function StudentFinishedCourse({ userID }) {
    const [finishedCourses, setFinishedCourses] = useState();

    useEffect(() => {
        if (userID)
            firebaseInit
                .getStudentRegisteredCourseDetails(userID)
                .then(data => {
                    const finishedCourse = data
                        .filter(course => {
                            return (
                                course.registrationStatus === 1 &&
                                course.courseStatus === 2
                            );
                        })
                        .sort(
                            (a, b) =>
                                b.courseClosedDate.seconds -
                                a.courseClosedDate.seconds,
                        );

                    setFinishedCourses(finishedCourse);
                });
    }, [userID]);

    return !finishedCourses ? (
        <Loading />
    ) : (
        <Container>
            {finishedCourses.length === 0 ? (
                <NoDataBox
                    marginTop="15px"
                    marginLeft="150px"
                    title="?????????????????????????????????????????????"
                    buttonWord="????????????"
                    path="/search?q=latest"
                />
            ) : (
                <CourseArea>
                    {finishedCourses.map(course => (
                        <CourseDiv key={course.courseID}>
                            <CourseInfo
                                teacherPhoto={course.teacherPhoto}
                                image={course.image}
                                title={course.title}
                                teacherName={course.teacherName}
                                openingDate={customDateDisplay(
                                    course.courseOpeningDate.seconds * 1000,
                                )}
                                closedDate={customDateDisplay(
                                    course.courseClosedDate.seconds * 1000,
                                )}
                            />
                        </CourseDiv>
                    ))}
                </CourseArea>
            )}
        </Container>
    );
}

StudentFinishedCourse.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default StudentFinishedCourse;
