import React, { Fragment, useEffect, useState } from "react";
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
import { BsReply } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../customHooks/useAlertModal";
import { AlertModal } from "../Component/AlertModal";
import { Loading } from "../Component/Loading";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;

    padding: 80px 10px 80px 10px;

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
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
    }
`;

const Collection = styled.div`
    margin-top: 20px;
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-radius: 5px;

    color: ${props => (props.collected ? "white" : "inherit")};
    background: ${props =>
        props.collected
            ? "linear-gradient(to left,#ff8f08 -10.47%,#ff6700 65.84%);"
            : "white"};

    cursor: pointer;

    @media ${breakPoint.desktop} {
        margin-left: 75%;
        width: 25%;
        order: 5;
        position: sticky;
        top: 460px;
        order: 5;
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
    border: 1px solid black;
    border-radius: 5px;
    margin-top: 20px;
    width: 300px;
    background-color: white;

    @media ${breakPoint.desktop} {
        align-self: stretch;
        position: sticky;
        order: 4;
        top: 50px;
        margin-left: auto;
        width: 25%;
        z-index: 2;
        margin-top: -75px;
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
        order: 3;
        padding-left: 0;
    }
`;
const AboutTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    margin-top: 10px;
    margin-bottom: 10px;

    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const AboutContent = styled.div`
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;

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
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;
const CourseIntroduction = styled.p`
    margin-top: 15px;
    font-size: 12px;
    line-height: 1.5;
    @media ${breakPoint.desktop} {
        font-size: 14px;
    }
`;

const RegisterArea = styled.div`
    display: flex;
    position: fixed;
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 100vw;
    background-color: whitesmoke;
    height: 50px;

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
    background-color: ${props => (props.active ? "gray" : "#ff6100")};
    border: none;
    cursor: ${props => (props.active ? "not-allowed" : "pointer")};

    @media ${breakPoint.desktop} {
        margin-top: 20px;
        height: 50px;
        width: 25%;
        margin-left: 75%;
        order: 6;

        position: sticky;
        top: 530px;
        z-index: 2;
    }
`;

const WebButton = styled(Button)`
    display: none;

    @media ${breakPoint.desktop} {
        display: block;
        margin-top: 20px;
        height: 50px;
        width: 25%;
        margin-left: 75%;
        order: 6;
    }
`;

const MessageArea = styled.div`
    width: 100%;
    @media ${breakPoint.desktop} {
        order: 7;
    }
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px 0 30px 0;
    width: 90%;
    margin: auto;
    @media ${breakPoint.desktop} {
        width: calc(75% - 10px);
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

export const Course = ({ userID }) => {
    const [courseData, setCourseData] = useState();
    const [userCollection, setUserCollection] = useState(false);
    const [message, setMessage] = useState("");
    const [inputFields, setInputFields] = useState([]);
    const [usersInfo, setUsersInfo] = useState();
    const [skillsInfo, setSkillsInfo] = useState();
    const navigate = useNavigate();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const courseID = new URLSearchParams(window.location.search).get(
        "courseID",
    );

    useEffect(() => {
        async function addView() {
            await updateDoc(doc(firebaseInit.db, "courses", courseID), {
                view: increment(1),
            });
        }
        addView();
    }, [courseID]);

    useEffect(() => {
        if (userID)
            firebaseInit.getCollectionData("users", userID).then(data => {
                const isCollect = data.collectCourses?.some(
                    collectCourse => collectCourse === courseID,
                );
                setUserCollection(isCollect);
            });
    }, [courseID, userID]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(firebaseInit.db, "courses", courseID),
            snapshot => {
                const courseDate = snapshot.data();
                console.log(courseDate);
                setCourseData(courseDate);
                setInputFields(
                    Array(courseDate.askedQuestions?.length || 0)
                        .fill()
                        .map(() => ({ reply: "", isShowReplyInput: false })),
                );

                const SkillsPromise = courseDate.getSkills.map(skill =>
                    firebaseInit.getCollectionData("skills", skill),
                );

                Promise.all(SkillsPromise).then(data => setSkillsInfo(data));
            },
        );

        return () => {
            unsubscribe();
        };
    }, [courseID]);
    useEffect(() => {
        firebaseInit
            .getCollection(collection(firebaseInit.db, "users"))
            .then(data => {
                console.log(data);
                setUsersInfo(data);
            });
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
                const confirmMessage = window.confirm(
                    "報名成功\n點選「確定」，查看報名狀態。\n點選「取消」，回到首頁。",
                );
                if (confirmMessage) {
                    navigate("/personal/student-registered-course");
                } else {
                    navigate("/");
                }
            });
        } catch (error) {
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
                                    <RiCloseCircleLine />
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
            {!courseData || !usersInfo ? (
                <Loading />
            ) : (
                <>
                    <>
                        <Container>
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
                                {userCollection ? "已收藏" : "加入收藏"}
                            </Collection>
                            <AboutCourse>
                                <AboutTitle>關於課程</AboutTitle>
                                <AboutContent>
                                    開班人數 {courseData.minOpeningNumber}
                                </AboutContent>
                                <AboutContent>
                                    報名截止{" "}
                                    {new Date(
                                        courseData.registrationDeadline
                                            .seconds * 1000,
                                    ).toLocaleDateString()}
                                </AboutContent>
                                <AboutContent>
                                    開課時間{" "}
                                    {new Date(
                                        courseData.openingDate.seconds * 1000,
                                    ).toLocaleDateString()}
                                </AboutContent>
                                <AboutContentsSkill>
                                    可獲技能{" "}
                                    <FlexDiv>
                                        {" "}
                                        {skillsInfo && (
                                            <Skills skills={skillsInfo} />
                                        )}
                                    </FlexDiv>
                                </AboutContentsSkill>
                                <AboutContent>
                                    課程詳情
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
                    </>
                    <AlertModal
                        content={alertMessage}
                        alertIsOpen={alertIsOpen}
                        setAlertIsOpen={setAlertIsOpen}
                    />
                </>
            )}
        </>
    );
};
