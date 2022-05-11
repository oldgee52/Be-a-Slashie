import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CourseInfo } from "../Component/CourseInfo";
import { Loading } from "../Component/Loading";
import { NoDataTitle } from "../Component/NoDataTitle";
import { useCustomDateDisplay } from "../customHooks/useCustomDateDisplay";
import { breakPoint } from "../utils/breakPoint";
import firebaseInit from "../utils/firebase";

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
export const StudentFinishedCourse = ({ userID }) => {
    const [finishedCourses, setFinishedCourses] = useState();
    const customDateDisplay = useCustomDateDisplay();
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
                    console.log(finishedCourse);
                    setFinishedCourses(finishedCourse);
                });
    }, [userID]);

    return (
        <>
            {!finishedCourses ? (
                <Loading />
            ) : finishedCourses.length === 0 ? (
                <Container>
                    <NoDataTitle title="還沒有完成的課程喔" />
                </Container>
            ) : (
                <Container>
                    <CourseArea>
                        {finishedCourses.map((course, index) => (
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
                                        course?.courseClosedDate.seconds * 1000,
                                    )}
                                />
                            </CourseDiv>
                        ))}
                    </CourseArea>
                </Container>
            )}
        </>
    );
};
