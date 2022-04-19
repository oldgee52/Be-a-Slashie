import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
`;

const Div12 = styled(Div1)`
    border: 1px solid black;
`;

const Div13 = styled(Div1)`
    border: 1px solid black;
    width: 50%;
    height: auto;
`;

const DivCourse = styled.h3`
    width: 100%;
`;

const DivContent = styled.div`
    padding-right: 20px;
    width: 100%;
`;

export const StudentRegisteredCourse = () => {
    const [registeredCourse, setRegisteredCourse] = useState();

    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

    useEffect(() => {
        firebaseInit.getStudentRegisteredCourseDetails(studentID).then(data => {
            console.log(data);
            setRegisteredCourse(data);
        });
    }, []);

    function renderCourses(status) {
        const showCourses = registeredCourse
            ?.filter(item => item.registrationStatus === status)
            .sort(
                (a, b) =>
                    b.courseOpeningDate.seconds - a.courseOpeningDate.seconds,
            );

        return (
            showCourses &&
            showCourses.map((course, index) => (
                <Div13 key={course.courseID}>
                    <DivContent>
                        項次
                        {index + 1}
                    </DivContent>
                    <DivContent>課程名稱: {course.title}</DivContent>
                    <DivContent>老師: {course.teacherName}</DivContent>
                    <DivContent>
                        開課日期:{" "}
                        {new Date(
                            course?.courseOpeningDate.seconds * 1000,
                        ).toLocaleDateString()}
                    </DivContent>
                    <DivContent>
                        課程報名狀態:
                        {course.courseStatus === 0 ? (
                            <Link to={`/course?courseID=${course.courseID}`}>
                                {" "}
                                報名中
                            </Link>
                        ) : (
                            " 已結束報名"
                        )}
                    </DivContent>
                </Div13>
            ))
        );
    }

    return (
        <Container>
            <Div12>
                <Div1>
                    <DivCourse>審核中</DivCourse>
                    {renderCourses(0)}
                </Div1>
            </Div12>
            <Div12>
                <Div1>
                    <DivCourse>已同意</DivCourse>
                    {renderCourses(1)}
                </Div1>
            </Div12>
            <Div12>
                <Div1>
                    <DivCourse>不同意</DivCourse>
                    {renderCourses(2)}
                </Div1>
            </Div12>
        </Container>
    );
};
