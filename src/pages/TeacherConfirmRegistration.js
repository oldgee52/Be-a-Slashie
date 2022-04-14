import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";

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

const DivCourse = styled.h3`
    width: 100%;
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
    const [registrationStatus, setRegistrationStatus] = useState();

    useEffect(() => {
        const teacherID = "QptFGccbXGVyiTwmvxFG07JNbjp1";
        firebaseInit.getRegistrationStudent(teacherID).then(data => {
            setCourses(data);
            setRegistrationStatus(data);
        });
    }, []);

    const handleChange = e => {
        const stateCopy = JSON.parse(JSON.stringify(registrationStatus));
        stateCopy.forEach(card => {
            card.students.forEach(student => {
                if (e.target.name === `${card.courseID}_${student.studentID}`)
                    student.registrationStatus = +e.target.value;
            });
        });
        console.log(stateCopy);

        setRegistrationStatus(stateCopy);
    };

    const confirmRegistration = async e => {
        const courseID = e.target.id;
        const courseArray = registrationStatus.filter(
            item => item.courseID === courseID,
        );
        console.log(courseArray);
        try {
            await Promise.all([
                updateDoc(doc(firebaseInit.db, "courses", courseID), {
                    status: 1,
                }),
                courseArray.forEach(element => {
                    element.students.forEach(student => {
                        const studentID = student.studentID;
                        const registrationStatus = student.registrationStatus;
                        updateDoc(
                            doc(
                                firebaseInit.db,
                                "courses",
                                courseID,
                                "students",
                                studentID,
                            ),
                            {
                                registrationStatus,
                            },
                        );
                    });
                }),
            ]);
            window.alert("開始上課囉!!!");
            return window.location.reload();
        } catch (error) {
            window.alert("開課失敗");
            console.log(error);
        }
    };
    return (
        <Container>
            {courses?.length === 0 ? (
                <div>目前沒有課程喔</div>
            ) : (
                courses?.map(course => (
                    <Div1 key={course.courseID}>
                        <DivCourse>{course.title}</DivCourse>
                        {course.students.map((student, index) => (
                            <DivContent key={index}>
                                <div>{student.name}</div>
                                <div>{student.email}</div>
                                <Div1>
                                    <input
                                        type="radio"
                                        id={`${course.courseID}_${student.studentID}_agree`}
                                        name={`${course.courseID}_${student.studentID}`}
                                        value={1}
                                        onChange={handleChange}
                                    />
                                    <label
                                        htmlFor={`${course.courseID}_${student.studentID}_agree`}
                                    >
                                        同意
                                    </label>
                                </Div1>
                                <Div1>
                                    <input
                                        type="radio"
                                        id={`${course.courseID}_${student.studentID}_disagree`}
                                        name={`${course.courseID}_${student.studentID}`}
                                        value={2}
                                        onChange={handleChange}
                                    />
                                    <label
                                        htmlFor={`${course.courseID}_${student.studentID}_disagree`}
                                    >
                                        不同意
                                    </label>
                                </Div1>
                            </DivContent>
                        ))}
                        <Button
                            id={course.courseID}
                            onClick={confirmRegistration}
                        >
                            準備來開課
                        </Button>
                    </Div1>
                ))
            )}
        </Container>
    );
};
