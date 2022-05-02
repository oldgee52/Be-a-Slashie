import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CourseInfo } from "../Component/CourseInfo";
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
            width: calc(25% - 10px);
        }
    }
`;

const CourseDiv = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        width: calc(28% - 10px);
        margin-right: 10px;
    }
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
`;
const NoShow = styled.div`
    margin-top: 10px;
    font-size: 16px;
    font-weight: 700;
`;

const Div13 = styled(Div1)`
    border: 1px solid black;
    width: 50%;
    height: auto;
`;

const DivContent = styled.div`
    padding-right: 20px;
    width: 100%;
`;

export const TeacherFinishedCourse = ({ userID }) => {
    const [finishedCourses, setFinishedCourses] = useState();

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
        <Container>
            {!finishedCourses ? (
                "loading..."
            ) : (
                <CourseArea>
                    {finishedCourses.length === 0 ? (
                        <NoShow>尚未有完成的課程喔</NoShow>
                    ) : (
                        finishedCourses.map((course, index) => (
                            <CourseDiv key={course.courseID}>
                                <CourseInfo
                                    // teacherPhoto={course.teacherInfo.photo}
                                    image={course.image}
                                    title={course.title}
                                    // teacherName={course.teacherInfo.name}
                                    // creatDate={new Date(
                                    //     course.creatTime.seconds * 1000,
                                    // ).toLocaleDateString()}
                                    openingDate={new Date(
                                        course.openingDate.seconds * 1000,
                                    ).toLocaleDateString()}
                                    closedDate={new Date(
                                        course?.closedDate.seconds * 1000,
                                    ).toLocaleDateString()}
                                />

                                {/* <DivContent>
                                項次
                                {index + 1}
                            </DivContent>
                            <DivContent>課程名稱: {course.title}</DivContent>{" "}
                            <DivContent>
                                完課日期:{" "}
                                {new Date(
                                    course?.closedDate.seconds * 1000,
                                ).toLocaleDateString()}
                            </DivContent>
                            <DivContent>
                                開課日期:{" "}
                                {new Date(
                                    course?.openingDate.seconds * 1000,
                                ).toLocaleDateString()}
                            </DivContent>
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
            )}
        </Container>
    );
};
