import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { map } from "@firebase/util";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
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

const DivCourse = styled.div`
    width: 100%;
`;

const DivTitle = styled.div`
    width: 20%;
`;
const DivContent = styled.div`
    width: 80%;
`;

const Button = styled.button`
    width: 100%;
    height: 48px;
    text-align: center;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background-color: #f44336;
    border: none;
    cursor: pointer;
`;

export const TeacherConfirmRegistration = () => {
    const [courses, setCourses] = useState();
    const teacherID = "QptFGccbXGVyiTwmvxFG07JNbjp1";

    useEffect(() => {
        firebaseInit
            .getRegistrationStudent("users", teacherID, "courses")
            .then(promise => Promise.all(promise))
            .then(data => setCourses(data));
    }, []);
    return (
        <Container>
            {courses &&
                courses.map(course => (
                    <Div1 key={course.courseID}>
                        <DivCourse>{course.title}</DivCourse>
                        {course.studentsID.map(student => (
                            <DivContent key={student}>
                                <div>{student}</div>
                                <Div1>
                                    <input
                                        type="radio"
                                        id={`${course.courseID}_${student}_agree`}
                                        name={`${course.courseID}_${student}`}
                                        value={1}
                                    />
                                    <label
                                        htmlFor={`${course.courseID}_${student}_agree`}
                                    >
                                        同意
                                    </label>
                                </Div1>
                                <Div1>
                                    <input
                                        type="radio"
                                        id={`${course.courseID}_${student}_disagree`}
                                        name={`${course.courseID}_${student}`}
                                        value={2}
                                    />
                                    <label
                                        htmlFor={`${course.courseID}_${student}_disagree`}
                                    >
                                        不同意
                                    </label>
                                </Div1>
                            </DivContent>
                        ))}
                        <Button>準備來開課</Button>
                    </Div1>
                ))}
        </Container>
    );
};
