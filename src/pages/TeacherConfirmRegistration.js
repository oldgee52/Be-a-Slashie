import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FiMail, FiInfo } from "react-icons/fi";
import firebaseInit from "../utils/firebase";
import breakPoint from "../utils/breakPoint";
import NoDataTitle from "../Component/common/NoDataTitle";
import AlertModal from "../Component/common/AlertModal";
import Loading from "../Component/loading/Loading";
import MyButton from "../Component/common/MyButton";
import MyRadioButton from "../Component/common/MyRadioButton";
import HoverInfo from "../Component/common/HoverInfo";
import NoDataBox from "../Component/common/NoDataBox";
import useAlertModal from "../customHooks/useAlertModal";
import { handleChangeForDeepCopy } from "../utils/functions";

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
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #505050;
    line-height: 1.2;

    word-break: break-all;
    @media ${breakPoint.desktop} {
        font-size: 22px;
    }
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

const ButtonArea = styled.div`
    @media ${breakPoint.desktop} {
        align-self: center;
    }
`;

const IconBox = styled.span`
    cursor: pointer;
    margin-right: 5px;
    margin-left: 5px;

    &::before {
        content: "${props => props.content}";
        position: absolute;
        transform: translateY(0px) translateX(-40%);
        background-color: #e9e9e9;
        color: #7f7f7f;
        font-size: 12px;
        width: max-content;
        overflow: hidden;
        padding: 5px;
        border-radius: 5px;
        z-index: -1;
        opacity: 0;
        transition-duration: 0.2s;
    }
    &:hover::before {
        opacity: 1;
        z-index: 10;
        transform: translateY(20px) translateX(-40%);
    }
`;

function TeacherConfirmRegistration({ userID }) {
    const [courses, setCourses] = useState();
    const [registrationStatus, setRegistrationStatus] = useState();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const navigate = useNavigate();

    useEffect(() => {
        if (userID)
            firebaseInit.getRegistrationStudent(userID).then(data => {
                setCourses(data);
                setRegistrationStatus(data);
            });
    }, [userID]);

    const handleChange = e => {
        const dataChange = {
            data: registrationStatus,
            targetName: e.target.name,
            dataKey: "registrationStatus",
            dataValue: +e.target.value,
            callback: setRegistrationStatus,
        };
        handleChangeForDeepCopy(dataChange);
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
            return handleAlertModal(`?????????${courseArray[0].title}\n
        ???????????????????????????????????????`);

        try {
            await Promise.all([
                firebaseInit.updateDocForTeacherOpeningCourse(courseID),
                firebaseInit.updateDocForStudentsCourseRegistrationStatus(
                    courseArray,
                    courseID,
                ),
            ]);
            handleAlertModal("???????????????!!!");
            const NewCourse = courses.filter(
                course => course.courseID !== courseID,
            );
            setCourses(NewCourse);
        } catch (error) {
            handleAlertModal(`??????????????????????????????${error}`);
        }

        return null;
    };

    return (
        <>
            {!courses ? (
                <Loading />
            ) : (
                <Container>
                    {courses.length === 0 ? (
                        <NoDataBox
                            marginTop="35px"
                            marginLeft="140px"
                            title="???????????????????????????????????????????????????"
                            buttonWord="????????????"
                            path="/personal/teacher-upload-course"
                        />
                    ) : (
                        courses.map(course => (
                            <CourseCard key={course.courseID}>
                                <CourseTitle>{course.title}</CourseTitle>
                                {course.students.length === 0 ? (
                                    <NoDataTitle title="?????????????????????" />
                                ) : (
                                    course.students.map(student => (
                                        <StudentInfoBoc key={student.name}>
                                            <Name>
                                                <span> {student.name} </span>
                                                <a
                                                    href={`mailto: ${student.email}`}
                                                >
                                                    <HoverInfo content="??????E-mail">
                                                        <FiMail viewBox="-1 -1 24 24" />
                                                    </HoverInfo>
                                                </a>{" "}
                                                <IconBox
                                                    content="??????????????????"
                                                    onClick={() =>
                                                        navigate(
                                                            `/personal-introduction?uid=${student.studentID}`,
                                                        )
                                                    }
                                                >
                                                    <FiInfo viewBox="-1 -1 24 24" />
                                                </IconBox>
                                            </Name>
                                            <InputArea>
                                                <MyRadioButton
                                                    title="??????"
                                                    inputId={`${course.courseID}_${student.studentID}_agree`}
                                                    inputName={`${course.courseID}_${student.studentID}`}
                                                    inputValue={1}
                                                    changeFunction={
                                                        handleChange
                                                    }
                                                />
                                                <MyRadioButton
                                                    title="?????????"
                                                    inputId={`${course.courseID}_${student.studentID}_disagree`}
                                                    inputName={`${course.courseID}_${student.studentID}`}
                                                    inputValue={2}
                                                    changeFunction={
                                                        handleChange
                                                    }
                                                />
                                            </InputArea>
                                        </StudentInfoBoc>
                                    ))
                                )}
                                {course.students.length === 0 || (
                                    <ButtonArea>
                                        <MyButton
                                            buttonWord="???????????????"
                                            buttonId={course.courseID}
                                            clickFunction={confirmRegistration}
                                        />
                                    </ButtonArea>
                                )}
                            </CourseCard>
                        ))
                    )}
                </Container>
            )}
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
}

TeacherConfirmRegistration.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default TeacherConfirmRegistration;
