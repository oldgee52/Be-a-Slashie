import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CourseInfo } from "../Component/CourseInfo";
import { breakPoint } from "../utils/breakPoint";
import { NoDataTitle } from "../Component/NoDataTitle";
import firebaseInit from "../utils/firebase";
import { Loading } from "../Component/Loading";
import { useCustomDateDisplay } from "../customHooks/useCustomDateDisplay";

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

export const TeacherFinishedCourse = ({ userID }) => {
    const [finishedCourses, setFinishedCourses] = useState();
    const customDateDisplay = useCustomDateDisplay();

    useEffect(() => {
        let isMounted = true;

        if (userID) {
            firebaseInit.getTeachersStatusCourses(userID, 2).then(data => {
                const finishedCourses = data.sort(
                    (a, b) => b.closedDate.seconds - a.closedDate.seconds,
                );
                console.log(finishedCourses);

                if (isMounted) setFinishedCourses(finishedCourses);
            });
        }

        return () => {
            isMounted = false;
        };
    }, [userID]);
    return (
        <>
            {!finishedCourses ? (
                <Loading />
            ) : (
                <Container>
                    <CourseArea>
                        {finishedCourses.length === 0 ? (
                            <NoDataTitle title="尚未有完成的課程喔" />
                        ) : (
                            finishedCourses.map((course, index) => (
                                <CourseDiv key={course.courseID}>
                                    <CourseInfo
                                        image={course.image}
                                        title={course.title}
                                        openingDate={customDateDisplay(
                                            course.openingDate.seconds * 1000,
                                        )}
                                        closedDate={customDateDisplay(
                                            course?.closedDate.seconds * 1000,
                                        )}
                                    />

                                    {/*
                            <DivContent>
                                學生:
                                {course.students.map(student => (
                                    <Div14 key={student.studentID}>
                                        <DivContent1>
                                            姓名: {student.name}
                                        </DivContent1>
                                        <DivContent1>
                                            email: {student.email}
                                        </DivContent1>
                                    </Div14>
                                ))}{" "}
                            </DivContent> */}
                                </CourseDiv>
                            ))
                        )}
                    </CourseArea>
                </Container>
            )}
        </>
    );
};
