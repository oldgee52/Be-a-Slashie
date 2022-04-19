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

export const StudentFinishedCourse = () => {
    const [finishedCourses, setFinishedCourses] = useState();
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";
    useEffect(() => {
        firebaseInit.getStudentRegisteredCourseDetails(studentID).then(data => {
            const finishedCourse = data
                .filter(course => {
                    return (
                        course.registrationStatus === 1 &&
                        course.courseStatus === 2
                    );
                })
                .sort(
                    (a, b) =>
                        b.courseClosedDate.seconds - a.courseClosedDate.seconds,
                );
            console.log(finishedCourse);
            setFinishedCourses(finishedCourse);
        });
    }, []);

    return (
        <Container>
            {!finishedCourses ? "loading..." : <Div1>學生已完成課程</Div1>}
            {finishedCourses &&
                finishedCourses.map((course, index) => (
                    <Div13 key={course.courseID}>
                        <DivContent>
                            項次
                            {index + 1}
                        </DivContent>
                        <DivContent>課程名稱: {course.title}</DivContent>
                        <DivContent>
                            老師: {course.teacherName}
                            <a href={`mailto: ${course.teacherEmail}`}>
                                與我聯繫
                            </a>
                        </DivContent>{" "}
                        <DivContent>
                            完課日期:{" "}
                            {new Date(
                                course?.courseClosedDate.seconds * 1000,
                            ).toLocaleDateString()}
                        </DivContent>
                        <DivContent>
                            開課日期:{" "}
                            {new Date(
                                course?.courseOpeningDate.seconds * 1000,
                            ).toLocaleDateString()}
                        </DivContent>
                    </Div13>
                ))}
        </Container>
    );
};
