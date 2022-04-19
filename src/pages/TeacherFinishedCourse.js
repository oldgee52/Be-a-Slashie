import React, { useEffect, useState } from "react";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";

const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
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

const DivContent1 = styled(DivContent)`
    padding-right: 0px;
`;

const Div14 = styled(Div13)`
    width: 100%;
`;

export const TeacherFinishedCourse = () => {
    const [finishedCourses, setFinishedCourses] = useState();
    const teacherID = "QptFGccbXGVyiTwmvxFG07JNbjp1";
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            firebaseInit.getTeachersStatusCourses(teacherID, 2).then(data => {
                const finishedCourses = data.sort(
                    (a, b) => b.closedDate.seconds - a.closedDate.seconds,
                );
                console.log(finishedCourses);

                setFinishedCourses(finishedCourses);
            });
        }

        return () => {
            isMounted = false;
        };
    }, []);
    return (
        <Container>
            {!finishedCourses ? "loading..." : <Div1>老師已完成課程</Div1>}
            {finishedCourses &&
                finishedCourses.map((course, index) => (
                    <Div13 key={course.courseID}>
                        <DivContent>
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
                        </DivContent>
                    </Div13>
                ))}
        </Container>
    );
};
