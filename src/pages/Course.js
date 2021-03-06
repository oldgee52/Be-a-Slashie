import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import firebaseInit from "../utils/firebase";
import email from "../utils/email";
import breakPoint from "../utils/breakPoint";
import useAlertModal from "../customHooks/useAlertModal";
import { customDateDisplay } from "../utils/functions";
import AlertModal from "../Component/common/AlertModal";
import Loading from "../Component/loading/Loading";
import LoadingForPost from "../Component/loading/LoadingForPost";
import Footer from "../Component/Footer";
import MyButton from "../Component/common/MyButton";
import TeacherInfoArea from "../Component/coursePage/TeacherInfoArea";
import CollectionButton from "../Component/coursePage/CollectionButton";
import CourseDetailInfo from "../Component/coursePage/CourseDetailInfo";
import CourseHeadersInfo from "../Component/coursePage/CourseHeadersInfo";
import MessageArea from "../Component/coursePage/MessageArea";
import BlurBackgroundArea from "../Component/coursePage/BlurBackgroundArea";
import useUserInfo from "../customHooks/useUserInfo";

const AlignCenter = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    ${AlignCenter}
    flex-wrap: wrap;
    width: 100%;
    margin: auto;

    padding: 80px 10px 0 10px;

    @media ${breakPoint.desktop} {
        justify-content: space-between;
        align-items: flex-start;
        max-width: 1200px;
        min-height: calc(100vh - 55px);
    }
`;

const RegisterArea = styled.div`
    ${AlignCenter}
    position: sticky;
    bottom: 0;
    width: 100%;
    background-color: whitesmoke;
    height: 50px;
    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const WebButtonBox = styled.div`
    display: none;
    @media ${breakPoint.desktop} {
        display: block;
        width: 100%;
        height: 50px;
        margin-top: 20px;
    }
`;

const TeacherInfoWebBox = styled.div`
    display: none;
    @media ${breakPoint.desktop} {
        display: block;
        position: sticky;
        top: 80px;
        margin-top: -150px;
        width: 25%;
        order: 3;
        z-index: 3;
    }
`;

function Course({ userID }) {
    const [courseData, setCourseData] = useState();
    const [userCollection, setUserCollection] = useState(false);
    const [inputFields, setInputFields] = useState([]);
    const [skillsInfo, setSkillsInfo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const [findUserInfo, usersInfo] = useUserInfo();
    const courseID = new URLSearchParams(window.location.search).get(
        "courseID",
    );

    useEffect(() => {
        if (!courseID) navigate("/");
    }, [courseID]);

    useEffect(() => {
        if (courseID) firebaseInit.updateDocForCourseAddView(courseID);
    }, [courseID]);

    useEffect(() => {
        if (userID && courseID)
            firebaseInit.getCollectionData("users", userID).then(data => {
                const isCollect = data.collectCourses?.some(
                    collectCourse => collectCourse === courseID,
                );
                setUserCollection(isCollect);
            });
    }, [courseID, userID]);

    useEffect(() => {
        if (courseID)
            firebaseInit.listenToCourseData(courseID, courseDate => {
                setCourseData(courseDate);
                setInputFields(
                    Array(courseDate.askedQuestions?.length || 0)
                        .fill()
                        .map(() => ({
                            reply: "",
                            isShowReplyInput: false,
                        })),
                );
                const SkillsPromise = courseDate.getSkills.map(skill =>
                    firebaseInit.getCollectionData("skills", skill),
                );
                Promise.all(SkillsPromise).then(data => setSkillsInfo(data));
            });
    }, [courseID]);

    async function handleCollection() {
        firebaseInit.updateDocForUserCollection(
            userID,
            courseData.courseID,
            userCollection,
        );
        setUserCollection(!userCollection);
    }

    const teacherPhoto =
        courseData?.teacherUserID &&
        findUserInfo(courseData.teacherUserID, "photo");
    const teacherEmail =
        courseData?.teacherUserID &&
        findUserInfo(courseData?.teacherUserID, "email");
    const teacherName =
        courseData?.teacherUserID &&
        findUserInfo(courseData?.teacherUserID, "name");

    async function handleRegistration(e) {
        e.preventDefault();
        setIsLoading(true);
        const studentName = findUserInfo(userID, "name");
        const studentEmail = findUserInfo(userID, "email");
        const openingDate = customDateDisplay(
            courseData.openingDate.seconds * 1000,
        );
        const courseTitle = courseData.title;

        const teacherEmailContent = {
            email: teacherEmail,
            subject: `${studentName}????????? ${courseData.title}????????????????????????`,
            html: email.registerTeacher({
                courseTitle,
                studentName,
                studentEmail,
                openingDate,
            }),
        };

        const studentEmailContent = {
            email: studentEmail,
            subject: `????????????${courseData.title}????????????????????????`,
            html: email.registerStudent(
                courseTitle,
                openingDate,
                teacherName,
                teacherEmail,
            ),
        };

        try {
            await Promise.all([
                firebaseInit.setDocToStudentRegisterCourse(
                    courseID,
                    userID,
                    courseData.teacherUserID,
                ),
                firebaseInit.updateDocForUserStudentsCourses(userID, courseID),
                firebaseInit.updateDocForCourseRegistrationNumber(courseID),
                email.sendEmail(studentEmailContent),
                email.sendEmail(teacherEmailContent),
            ]).then(() => {
                setIsLoading(false);
                navigate(`/finished-Registered-Course/${courseID}`);
            });
        } catch (error) {
            setIsLoading(false);
            handleAlertModal("?????????????????????????????????");
        }
    }

    function checkStudentIsRegistered() {
        return findUserInfo(userID, "studentsCourses")?.some(
            value => value === courseID,
        );
    }

    function checkIsTeacher() {
        return courseData.teacherUserID === userID;
    }

    function renderCourseHeadersInfo() {
        return (
            <CourseHeadersInfo
                title={courseData.title}
                registrationNumber={courseData.registrationNumber}
                view={courseData.view}
            />
        );
    }

    function renderTeacherInfoArea() {
        return (
            <TeacherInfoArea
                teacherPhoto={teacherPhoto}
                teacherEmail={teacherEmail}
                teacherName={teacherName}
                teacherIntroduction={courseData.teacherIntroduction}
            />
        );
    }

    function renderCollectionButton() {
        return (
            <CollectionButton
                handleCollection={() => handleCollection()}
                userCollection={userCollection}
            />
        );
    }

    function renderRegistrationButton(width) {
        let buttonWord = "????????????";
        if (checkIsTeacher()) {
            buttonWord = "???????????????";
        }
        if (checkStudentIsRegistered()) {
            buttonWord = "??????????????????";
        }
        return (
            <MyButton
                clickFunction={e => handleRegistration(e)}
                isDisabled={checkIsTeacher() || checkStudentIsRegistered()}
                buttonWord={buttonWord}
                width={width}
            />
        );
    }

    return !courseData || !skillsInfo || !usersInfo ? (
        <Loading />
    ) : (
        <>
            <>
                <Container>
                    <BlurBackgroundArea img={courseData.image} isWeb={false}>
                        {renderCourseHeadersInfo()}
                        {renderTeacherInfoArea()}
                        {renderCollectionButton()}
                    </BlurBackgroundArea>
                    <BlurBackgroundArea img={courseData.image} isWeb>
                        {renderCourseHeadersInfo()}
                    </BlurBackgroundArea>
                    <TeacherInfoWebBox>
                        {renderTeacherInfoArea()}
                        {renderCollectionButton()}
                        <WebButtonBox>
                            {renderRegistrationButton("100%")}
                        </WebButtonBox>
                    </TeacherInfoWebBox>
                    <CourseDetailInfo
                        minOpeningNumber={Number(courseData.minOpeningNumber)}
                        registrationDeadline={
                            courseData.registrationDeadline.seconds * 1000
                        }
                        openingDate={courseData.openingDate.seconds * 1000}
                        skillsInfo={skillsInfo}
                        courseIntroduction={courseData.courseIntroduction}
                    />
                    <MessageArea
                        courseData={courseData}
                        setInputFields={setInputFields}
                        inputFields={inputFields}
                        handleAlertModal={handleAlertModal}
                        userID={userID}
                        findUserInfo={findUserInfo}
                    />
                </Container>
                <RegisterArea>{renderRegistrationButton("80%")}</RegisterArea>
                <Footer />
            </>
            {isLoading && <LoadingForPost />}
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
                isNavigateToOtherRouter={false}
            />
        </>
    );
}

Course.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default Course;
