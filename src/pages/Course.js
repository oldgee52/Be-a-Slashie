import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import {
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    increment,
    arrayRemove,
    onSnapshot,
    collection,
    Timestamp,
} from "firebase/firestore";
import styled from "styled-components";
import { Skills } from "../Component/Skills";
import email from "../utils/email";
import { breakPoint } from "../utils/breakPoint";
import { FiMail } from "react-icons/fi";
import {
    BsReply,
    BsPersonCheck,
    BsCalendarPlus,
    BsCalendarCheck,
    BsPatchCheck,
    BsCardText,
    BsBookmark,
} from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../customHooks/useAlertModal";
import { AlertModal } from "../Component/AlertModal";
import { Loading } from "../Component/Loading";
import { LoadingForPost } from "../Component/LoadingForPost";
import { Footer } from "../Component/Footer";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;

    padding: 80px 10px 80px 10px;

    @media ${breakPoint.desktop} {
        justify-content: space-between;
        align-items: flex-start;
        max-width: 1200px;
    }
`;

const CourseTitle = styled.div`
    font-size: 20px;
    font-weight: 700;
    width: 100%;

    text-align: center;

    line-height: 1.5;

    @media ${breakPoint.desktop} {
        text-align: left;
        font-size: 24px;
        padding-left: 20px;
    }
`;

const Collection = styled.button`
    margin-top: 20px;
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-radius: 5px;
    font-size: 16px;
    border: ${props => (props.collected ? "none" : "1px solid #505050")};

    color: ${props => (props.collected ? "whitesmoke" : " #505050")};
    background: ${props => (props.collected ? "#00e0b6" : "whitesmoke")};
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    @media ${breakPoint.desktop} {
        width: 100%;
        z-index: 2;
    }
`;

const CourseInfo = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        margin-bottom: 20px;
        justify-content: flex-start;
        /* width: 25%; */
        order: 1;
        padding-left: 20px;
    }
`;
const InfoTitle = styled.div`
    margin-left: 5px;
    margin-right: 5px;
    @media ${breakPoint.desktop} {
        margin-left: 0px;
        margin-right: 10px;
    }
`;

const TeacherInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    margin-top: 20px;
    width: 300px;
    background-color: whitesmoke;
    min-height: 250px;
    color: #505050;
    border: 1px solid #00e0b6;
    @media ${breakPoint.desktop} {
        margin: 0;
        width: 100%;
    }
`;

const TeacherImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
`;
const TeacherName = styled.div`
    font-size: 16px;
    font-weight: 600;
    margin-top: 5px;
`;
const TeacherIntroduction = styled.div`
    font-size: 12px;
    line-height: 1.5;

    padding: 20px;
`;
const NewFiMail = styled(FiMail)`
    color: rgba(0, 0, 0, 0.3);
`;

const AboutCourse = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding-left: 5px;

    @media ${breakPoint.desktop} {
        align-self: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
        width: calc(75% - 20px);
        padding-left: 20px;
        order: 2;
    }
`;
const AboutTitle = styled.div`
    font-size: 20px;

    margin-top: 10px;
    margin-bottom: 10px;
    color: #ff6700;

    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const AboutContent = styled.div`
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 5px;

    @media ${breakPoint.desktop} {
        padding-right: 50px;
    }
`;

const AboutContentsSkill = styled(AboutContent)`
    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const FlexDiv = styled.div`
    display: flex;
    margin-top: 20px;
    justify-content: center;
    width: 100%;
    margin-left: 10px;
    font-weight: 500;
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;
const CourseIntroduction = styled.p`
    margin-top: 15px;
    font-size: 12px;
    line-height: 1.5;
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        font-size: 14px;
    }
`;

const RegisterArea = styled.div`
    display: flex;
    position: sticky;
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 100%;
    background-color: whitesmoke;
    height: 50px;
    /* margin-top: 50px; */

    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const Button = styled.button`
    width: 80%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background: ${props =>
        props.active
            ? "gray"
            : "linear-gradient(to left,#ff8f08 -10.47%,#ff6700 65.84%)"};
    border: none;
    cursor: ${props => (props.active ? "not-allowed" : "pointer")};
`;

const WebButton = styled(Button)`
    display: none;

    @media ${breakPoint.desktop} {
        display: block;
        width: 100%;
        height: 50px;
        margin-top: 20px;
    }
`;

const MessageArea = styled.div`
    width: 100%;
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        order: 4;
    }
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0 30px 0;
    width: 90%;
    margin: auto;
    border-top: 1px solid #7f7f7f;
    @media ${breakPoint.desktop} {
        width: calc(75% - 20px);
        margin: 0;
    }
`;

const MessageHeader = styled.div`
    font-size: 18px;
`;

const MessageInputArea = styled.div`
    display: flex;
    flex-direction: column;
    background-color: whitesmoke;
    border: 1px solid whitesmoke;
    border-radius: 5px;
    width: 100%;
    padding: 20px;
    padding-bottom: 10px;
    margin-top: 20px;
`;
const Input = styled.textarea`
    width: 100%;
    height: 80px;

    padding: 5px;

    font-size: 16px;
`;

const SendButton = styled.button`
    width: 50px;
    height: 30px;
    line-height: 30px;
    background-color: #00e0b6;
    color: white;
    margin-left: auto;
    margin-top: 10px;

    border-radius: 5px;
`;

const CurrentMessageArea = styled.div`
    display: flex;
    flex-direction: column;
    color: gray;

    border-bottom: 1px solid gray;
    padding-bottom: 5px;
    @media ${breakPoint.desktop} {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;
const CurrentMessageTitle = styled.div`
    font-size: 14px;
    margin-bottom: 8px;
    @media ${breakPoint.desktop} {
        margin-right: 10px;
        margin-bottom: 10px;
    }
`;
const CurrentMessageContent = styled.div`
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.8);
    word-break: break-all;

    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const ReplyMessageArea = styled.div`
    display: flex;
    flex-direction: column;
    color: gray;

    align-items: flex-end;

    margin-top: 10px;
    margin-left: 30px;

    border-bottom: 1px solid gray;
    padding-bottom: 5px;
    @media ${breakPoint.desktop} {
        justify-content: flex-end;
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const ReplyMessageContent = styled(CurrentMessageContent)`
    align-self: flex-start;
    word-break: break-all;
`;

const ReplyMessageInputArea = styled(MessageInputArea)`
    margin: 0;
    padding-right: 0;
    padding-left: 30px;
    padding-top: 0;
    transition-duration: 1s;
    overflow: hidden;

    height: ${props => (props.show ? "150px" : 0)};
`;

const IsShowReply = styled.div`
    margin-left: 30px;
    margin-top: 10px;

    cursor: pointer;
`;

const ReplyInput = styled(Input)`
    margin-top: 20px;
`;

const BlurImage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: whitesmoke;

    &::before {
        content: "";
        top: -50px;
        left: -15px;
        width: 100vw;
        height: 98%;
        position: absolute;
        background-image: url(${props => props.img});
        background-size: cover;
        background-repeat: no-repeat;
        filter: blur(5px) brightness(60%);
    }
    @media ${breakPoint.desktop} {
        display: none;
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

const BlurImageWeb = styled(BlurImage)`
    display: none;
    @media ${breakPoint.desktop} {
        display: block;
        width: 100%;
        height: 150px;
        &::before {
            width: 100%;
            height: 120%;
            left: 0;
            background-image: url(${props => props.img});
        }
    }
`;

const NewBsPersonCheck = styled(BsPersonCheck)`
    width: 20px;
`;
const NewBsCalendarPlus = styled(BsCalendarPlus)`
    width: 20px;
`;

const NewBsCalendarCheck = styled(BsCalendarCheck)`
    width: 20px;
    margin-right: 5px;
`;
const NewBsPatchCheck = styled(BsPatchCheck)`
    width: 20px;
    margin-right: 5px;
`;
const NewBsCardText = styled(BsCardText)`
    width: 20px;
    margin-right: 5px;
`;

const NewBsBookmark = styled(BsBookmark)`
    width: 20px;
    margin-right: 5px;
`;

export const Course = ({ userID }) => {
    const [courseData, setCourseData] = useState();
    const [userCollection, setUserCollection] = useState(false);
    const [message, setMessage] = useState("");
    const [inputFields, setInputFields] = useState([]);
    const [usersInfo, setUsersInfo] = useState();
    const [skillsInfo, setSkillsInfo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const courseID = new URLSearchParams(window.location.search).get(
        "courseID",
    );

    useEffect(() => {
        if (!courseID) navigate("/");
    }, [courseID]);

    useEffect(() => {
        async function addView() {
            await updateDoc(doc(firebaseInit.db, "courses", courseID), {
                view: increment(1),
            });
        }
        if (courseID) addView();
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
        let unsubscribe;
        if (courseID)
            unsubscribe = onSnapshot(
                doc(firebaseInit.db, "courses", courseID),
                snapshot => {
                    const courseDate = snapshot.data();
                    console.log(courseDate);
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

                    Promise.all(SkillsPromise).then(data =>
                        setSkillsInfo(data),
                    );
                },
            );

        return () => {
            if (courseID) unsubscribe();
        };
    }, [courseID]);
    useEffect(() => {
        let isMounted = true;
        firebaseInit
            .getCollection(collection(firebaseInit.db, "users"))
            .then(data => {
                console.log(data);
                if (isMounted) setUsersInfo(data);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    function findUserInfo(userID, info) {
        const result = usersInfo.filter(array => array.uid === userID);

        return result[0][info];
    }

    async function handleCollection() {
        if (userCollection) {
            await updateDoc(doc(firebaseInit.db, "users", userID), {
                collectCourses: arrayRemove(courseData.courseID),
            });
            setUserCollection(false);
        }
        if (!userCollection) {
            await updateDoc(doc(firebaseInit.db, "users", userID), {
                collectCourses: arrayUnion(courseData.courseID),
            });
            setUserCollection(true);
        }
    }
    async function handleRegistration(e) {
        e.preventDefault();
        setIsLoading(true);
        const studentName = findUserInfo(userID, "name");
        const studentEmail = findUserInfo(userID, "email");
        const teacherName = findUserInfo(courseData.teacherUserID, "name");
        const teacherEmail = findUserInfo(courseData.teacherUserID, "email");
        const openingDate = new Date(
            courseData.openingDate.seconds * 1000,
        ).toLocaleDateString();
        const courseTitle = courseData.title;

        const teacherEmailContent = {
            email: teacherEmail,
            subject: `${studentName}已報名 ${courseData.title}，請再與學生連繫`,
            html: email.registerTeacher({
                courseTitle,
                studentName,
                studentEmail,
                openingDate,
            }),
        };

        const studentEmailContent = {
            email: studentEmail,
            subject: `您已報名${courseData.title}，請靜待老師確認`,
            html: email.registerStudent(
                courseTitle,
                openingDate,
                teacherName,
                teacherEmail,
            ),
        };

        try {
            await Promise.all([
                setDoc(
                    doc(
                        firebaseInit.db,
                        "courses",
                        courseData.courseID,
                        "students",
                        userID,
                    ),
                    {
                        teacherUserID: courseData.teacherUserID,
                        courseID: courseData.courseID,
                        studentUserID: userID,
                        registrationStatus: 0,
                    },
                ),
                updateDoc(doc(firebaseInit.db, "users", userID), {
                    studentsCourses: arrayUnion(courseData.courseID),
                }),
                updateDoc(
                    doc(firebaseInit.db, "courses", courseData.courseID),
                    {
                        registrationNumber: increment(1),
                    },
                ),
                email.sendEmail(studentEmailContent),
                email.sendEmail(teacherEmailContent),
            ]).then(() => {
                setIsLoading(false);
                navigate(`/finished-Registered-Course/${courseData.courseID}`);
            });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            handleAlertModal("發生錯誤，請重新試一次");
        }
    }
    async function handSendMessage() {
        if (!message.trim()) return handleAlertModal("請輸入訊息");

        await updateDoc(doc(firebaseInit.db, "courses", courseData.courseID), {
            askedQuestions: arrayUnion({
                askedContent: message,
                askedDate: new Date(),
                askedUserID: userID,
                replies: [],
            }),
        });
        setMessage("");

        return handleAlertModal("留言已送出");
    }

    function renderMessages() {
        return (
            courseData.askedQuestions &&
            courseData.askedQuestions
                .map((question, index) => (
                    <MessageInputArea key={index}>
                        <CurrentMessageArea>
                            <CurrentMessageTitle>
                                {usersInfo &&
                                    findUserInfo(question.askedUserID, "name")}
                            </CurrentMessageTitle>
                            <CurrentMessageTitle>
                                {new Date(
                                    question.askedDate.seconds * 1000,
                                ).toLocaleDateString()}
                            </CurrentMessageTitle>
                            <CurrentMessageContent>
                                {question.askedContent}
                            </CurrentMessageContent>
                        </CurrentMessageArea>
                        {question.replies &&
                            question.replies.map((reply, index_2) => (
                                <ReplyMessageArea key={index_2}>
                                    <CurrentMessageTitle>
                                        {usersInfo &&
                                            findUserInfo(
                                                reply.repliedUserID,
                                                "name",
                                            )}
                                    </CurrentMessageTitle>
                                    <CurrentMessageTitle>
                                        {new Date(
                                            reply.repliedDate.seconds * 1000,
                                        ).toLocaleDateString()}
                                    </CurrentMessageTitle>
                                    <ReplyMessageContent>
                                        {reply.repliedContent}
                                    </ReplyMessageContent>
                                </ReplyMessageArea>
                            ))}
                        <IsShowReply
                            onClick={() => {
                                handleShowReplyInput(index);
                            }}
                        >
                            {inputFields[index]?.isShowReplyInput ? (
                                <>
                                    <RiCloseCircleLine viewBox="0 -2 24 24" />{" "}
                                    取消
                                </>
                            ) : (
                                <>
                                    <BsReply /> 回覆
                                </>
                            )}
                        </IsShowReply>
                        <ReplyMessageInputArea
                            key={index}
                            show={inputFields[index]?.isShowReplyInput}
                        >
                            <ReplyInput
                                value={inputFields[index]?.reply || ""}
                                name="reply"
                                onChange={e => handleReplyMessage(e, index)}
                                show={inputFields[index]?.isShowReplyInput}
                            />
                            <SendButton
                                onClick={() => handleSendReplyMessage(index)}
                            >
                                回覆
                            </SendButton>
                        </ReplyMessageInputArea>
                    </MessageInputArea>
                ))
                .reverse()
        );
    }

    const handleReplyMessage = (e, index) => {
        let data = [...inputFields];
        data[index][e.target.name] = e.target.value;
        setInputFields(data);
    };

    const handleShowReplyInput = index => {
        let data = [...inputFields];
        data[index]["isShowReplyInput"] = !data[index]["isShowReplyInput"];
        setInputFields(data);
    };

    const handleSendReplyMessage = async index => {
        if (!inputFields[index].reply.trim())
            return handleAlertModal("請輸入訊息");
        const stateCopy = JSON.parse(JSON.stringify(courseData));

        stateCopy.askedQuestions.forEach((question, i) => {
            if (i === index) {
                question.replies.push({
                    repliedContent: inputFields[index].reply,
                    repliedDate: Timestamp.now(),
                    repliedUserID: userID,
                });
            }
        });

        await updateDoc(doc(firebaseInit.db, "courses", courseData.courseID), {
            askedQuestions: stateCopy.askedQuestions,
        });

        return handleAlertModal("回覆已送出");
    };

    return (
        <>
            {!courseData || !usersInfo || !skillsInfo ? (
                <Loading />
            ) : (
                <>
                    <>
                        <Container>
                            <BlurImage img={courseData.image}>
                                <CourseTitle>{courseData.title}</CourseTitle>
                                <CourseInfo>
                                    <InfoTitle>
                                        報名人數 {courseData.registrationNumber}
                                    </InfoTitle>

                                    <InfoTitle>
                                        瀏覽人數 {courseData.view}
                                    </InfoTitle>
                                </CourseInfo>
                                <TeacherInfo>
                                    <TeacherImg
                                        src={findUserInfo(
                                            courseData.teacherUserID,
                                            "photo",
                                        )}
                                    />
                                    <a
                                        href={`mailto:${findUserInfo(
                                            courseData.teacherUserID,
                                            "email",
                                        )}`}
                                    >
                                        <NewFiMail />
                                    </a>
                                    <TeacherName>
                                        {findUserInfo(
                                            courseData.teacherUserID,
                                            "name",
                                        )}
                                    </TeacherName>
                                    <TeacherIntroduction>
                                        {courseData.teacherIntroduction}
                                    </TeacherIntroduction>
                                </TeacherInfo>
                                <Collection
                                    onClick={handleCollection}
                                    collected={userCollection}
                                >
                                    <NewBsBookmark />
                                    <span>
                                        {userCollection ? "已收藏" : "加入收藏"}
                                    </span>
                                </Collection>{" "}
                            </BlurImage>
                            <BlurImageWeb img={courseData.image}>
                                <CourseTitle>{courseData.title}</CourseTitle>
                                <CourseInfo>
                                    <InfoTitle>
                                        報名人數 {courseData.registrationNumber}
                                    </InfoTitle>

                                    <InfoTitle>
                                        瀏覽人數 {courseData.view}
                                    </InfoTitle>
                                </CourseInfo>
                            </BlurImageWeb>
                            <TeacherInfoWebBox>
                                <TeacherInfo>
                                    <TeacherImg
                                        src={findUserInfo(
                                            courseData.teacherUserID,
                                            "photo",
                                        )}
                                    />
                                    <a
                                        href={`mailto:${findUserInfo(
                                            courseData.teacherUserID,
                                            "email",
                                        )}`}
                                    >
                                        <NewFiMail />
                                    </a>
                                    <TeacherName>
                                        {findUserInfo(
                                            courseData.teacherUserID,
                                            "name",
                                        )}
                                    </TeacherName>
                                    <TeacherIntroduction>
                                        {courseData.teacherIntroduction}
                                    </TeacherIntroduction>
                                </TeacherInfo>
                                <Collection
                                    onClick={handleCollection}
                                    collected={userCollection}
                                >
                                    <NewBsBookmark />
                                    <span>
                                        {userCollection ? "已收藏" : "加入收藏"}
                                    </span>
                                </Collection>
                                <WebButton
                                    onClick={handleRegistration}
                                    disabled={
                                        courseData.teacherUserID === userID ||
                                        findUserInfo(
                                            userID,
                                            "studentsCourses",
                                        )?.some(value => value === courseID)
                                    }
                                    active={
                                        courseData.teacherUserID === userID ||
                                        findUserInfo(
                                            userID,
                                            "studentsCourses",
                                        )?.some(value => value === courseID)
                                    }
                                >
                                    {courseData.teacherUserID === userID
                                        ? "您是老師喔"
                                        : findUserInfo(
                                              userID,
                                              "studentsCourses",
                                          )?.some(value => value === courseID)
                                        ? "你已經報名囉"
                                        : "我要報名"}
                                </WebButton>
                            </TeacherInfoWebBox>
                            <AboutCourse>
                                <AboutTitle>關於課程</AboutTitle>
                                <AboutContent>
                                    <NewBsPersonCheck viewBox="0 0 16 16" />{" "}
                                    <span>
                                        開班人數 {courseData.minOpeningNumber}
                                    </span>
                                </AboutContent>
                                <AboutContent>
                                    <NewBsCalendarPlus viewBox="2 0 16 16" />{" "}
                                    <span>
                                        報名截止{" "}
                                        {new Date(
                                            courseData.registrationDeadline
                                                .seconds * 1000,
                                        ).toLocaleDateString()}{" "}
                                    </span>
                                </AboutContent>
                                <AboutContent>
                                    <NewBsCalendarCheck viewBox="2 0 16 16" />
                                    <span>
                                        開課時間{" "}
                                        {new Date(
                                            courseData.openingDate.seconds *
                                                1000,
                                        ).toLocaleDateString()}
                                    </span>
                                </AboutContent>
                                <AboutContentsSkill>
                                    <NewBsPatchCheck viewBox="2 0 16 16" />
                                    <span>
                                        可獲技能{" "}
                                        <FlexDiv>
                                            <Skills skills={skillsInfo} />
                                        </FlexDiv>
                                    </span>
                                </AboutContentsSkill>
                                <AboutContent>
                                    <NewBsCardText viewBox="2 0 16 16" />
                                    <span>課程詳情</span>
                                    <CourseIntroduction>
                                        {courseData.courseIntroduction}
                                    </CourseIntroduction>
                                </AboutContent>
                            </AboutCourse>{" "}
                            <MessageArea>
                                <MessageContainer>
                                    <MessageHeader>上課前問問</MessageHeader>
                                    <MessageInputArea>
                                        <Input
                                            value={message}
                                            onChange={e =>
                                                setMessage(e.target.value)
                                            }
                                        />
                                        <SendButton onClick={handSendMessage}>
                                            送出
                                        </SendButton>
                                    </MessageInputArea>
                                    {renderMessages()}
                                </MessageContainer>
                            </MessageArea>
                        </Container>
                        <RegisterArea>
                            <Button
                                onClick={handleRegistration}
                                disabled={
                                    courseData.teacherUserID === userID ||
                                    findUserInfo(
                                        userID,
                                        "studentsCourses",
                                    )?.some(value => value === courseID)
                                }
                                active={
                                    courseData.teacherUserID === userID ||
                                    findUserInfo(
                                        userID,
                                        "studentsCourses",
                                    )?.some(value => value === courseID)
                                }
                            >
                                {courseData.teacherUserID === userID
                                    ? "您是老師喔"
                                    : findUserInfo(
                                          userID,
                                          "studentsCourses",
                                      )?.some(value => value === courseID)
                                    ? "你已經報名囉"
                                    : "我要報名"}
                            </Button>
                        </RegisterArea>
                        <Footer />
                    </>
                    {isLoading ? <LoadingForPost /> : ""}
                    <AlertModal
                        content={alertMessage}
                        alertIsOpen={alertIsOpen}
                        setAlertIsOpen={setAlertIsOpen}
                        isNavigateToOtherRouter={true}
                        pathname={`/course?courseID=${courseID}`}
                    />
                </>
            )}
        </>
    );
};
