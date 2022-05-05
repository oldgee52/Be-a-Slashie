import React, { useEffect, useState } from "react";
import { MyButton } from "../Component/MyButton";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { breakPoint } from "../utils/breakPoint";
import { FiMail, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { NoDataTitle } from "../Component/NoDataTitle";
import { AlertModal } from "../Component/AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";

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
        margin-top: -150px;
    }
`;
const CourseCard = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: whitesmoke;
    margin-bottom: 10px;

    border-radius: 5px;
`;

const CourseTitle = styled.h3`
    font-size: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #505050;
    line-height: 1.2;

    word-break: break-all;
`;

const StudentInfoBoc = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px 0;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 10px 0;
    border-radius: 5px;

    @media ${breakPoint.desktop} {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const Name = styled.div`
    margin-top: 5px;
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        width: 40%;
    }
`;

const InputArea = styled.div`
    display: flex;
    margin-top: 10px;
    width: 100%;
    justify-content: space-around;
    @media ${breakPoint.desktop} {
        width: 30%;
        margin-top: 0;
    }
`;

const InputLabel = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;

    cursor: pointer;
`;

const Agreement = styled.div`
    margin-left: 5px;
`;

const ButtonArea = styled.div`
    @media ${breakPoint.desktop} {
        align-self: center;
    }
`;

const NewFiInfo = styled(FiInfo)`
    cursor: pointer;
`;
const NoShow = styled.div`
    margin-top: 10px;
    font-size: 16px;
    font-weight: 700;
`;

export const TeacherConfirmRegistration = ({ userID }) => {
    const [courses, setCourses] = useState();
    const [registrationStatus, setRegistrationStatus] = useState();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const navigate = useNavigate();

    useEffect(() => {
        if (userID)
            firebaseInit.getRegistrationStudent(userID).then(data => {
                console.log(data);
                setCourses(data);
                setRegistrationStatus(data);
            });
    }, [userID]);

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

        const checkRegistrationStatus = courseArray[0].students
            .map(student => student.registrationStatus)
            .some(value => value === 0);

        if (checkRegistrationStatus)
            return handleAlertModal(`課程：${courseArray[0].title}\n
        請確認所有學生是否同意上課`);

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
            handleAlertModal("開始上課囉!!!");
            const NewCourse = courses.filter(
                course => course.courseID !== courseID,
            );
            setCourses(NewCourse);
        } catch (error) {
            handleAlertModal("開課失敗");
            console.log(error);
        }
    };
    return (
        <>
            <Container>
                {courses?.length === 0 ? (
                    <NoDataTitle title="目前沒有課程喔" />
                ) : (
                    courses &&
                    courses.map(course => (
                        <CourseCard key={course.courseID}>
                            <CourseTitle>{course.title}</CourseTitle>
                            {course.students.length === 0 ? (
                                <NoShow>還沒有人報名喔!</NoShow>
                            ) : (
                                course.students.map((student, index) => (
                                    <StudentInfoBoc key={index}>
                                        <Name>
                                            {student.name}{" "}
                                            <a
                                                href={`mailto: ${student.email}`}
                                            >
                                                <FiMail />
                                            </a>{" "}
                                            <NewFiInfo
                                                onClick={() =>
                                                    navigate(
                                                        `/personal-introduction?uid=${student.studentID}`,
                                                    )
                                                }
                                            />
                                        </Name>
                                        <InputArea>
                                            <InputLabel
                                                htmlFor={`${course.courseID}_${student.studentID}_agree`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`${course.courseID}_${student.studentID}_agree`}
                                                    name={`${course.courseID}_${student.studentID}`}
                                                    value={1}
                                                    onChange={handleChange}
                                                />
                                                <Agreement>同意</Agreement>
                                            </InputLabel>{" "}
                                            <InputLabel
                                                htmlFor={`${course.courseID}_${student.studentID}_disagree`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`${course.courseID}_${student.studentID}_disagree`}
                                                    name={`${course.courseID}_${student.studentID}`}
                                                    value={2}
                                                    onChange={handleChange}
                                                />

                                                <Agreement>不同意</Agreement>
                                            </InputLabel>
                                        </InputArea>
                                    </StudentInfoBoc>
                                ))
                            )}
                            {course.students.length === 0 || (
                                <ButtonArea>
                                    <MyButton
                                        buttonWord="準備來開課"
                                        buttonId={course.courseID}
                                        clickFunction={confirmRegistration}
                                    />
                                </ButtonArea>
                            )}
                        </CourseCard>
                    ))
                )}
            </Container>
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
};
