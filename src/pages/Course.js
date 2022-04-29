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
import { BsBookmark } from "react-icons/bs";

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
        /* flex-direction: column; */
        max-width: 1200px;
    }
`;

const CourseTitle = styled.div`
    font-size: 20px;
    font-weight: 700;
    width: 100%;
    /* height: 200px; */

    text-align: center;

    /* background-image: url(${props => props.img});
    background-repeat: no-repeat;
    background-size: cover;
    backdrop-filter: blur(5px); */

    line-height: 1.5;

    @media ${breakPoint.desktop} {
        text-align: left;
        font-size: 24px;
    }
`;
// const Test = styled.div`
//  backdrop-filter: blur(5px);
//  width: 100%;
//  height: 100px;
//  position: fixed;
//  top: 200px;

// `

const Collection = styled.div`
    margin-top: 20px;
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    border: 1px solid black;
    border-radius: 5px;

    color: ${props => (props.collected ? "white" : "black")};
    background-color: ${props => (props.collected ? "#ff6100" : "white")};

    cursor: pointer;

    @media ${breakPoint.desktop} {
        margin-left: 75%;
        width: 25%;
        order: 5;
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

    /* height: 150px;
    overflow: hidden;
    transition-duration: 2s;
    &:hover {
        height: unset;
    } */

    @media ${breakPoint.desktop} {
        /* position: sticky; */
        order: 4;
        /* top: 50px; */
        margin-left: auto;
        width: 25%;
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

// const NewBiTag = styled(BiTag)`
//     transform: rotate(270deg);
//     width: 20px;
//     height: 20px;
// `;

const Input = styled.input`
    width: 50%;
    height: 20px;
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

export const Course = () => {
    const [courseData, setCourseData] = useState();
    const [userCollection, setUserCollection] = useState(false);
    const [message, setMessage] = useState("");
    const [inputFields, setInputFields] = useState([]);
    const [usersInfo, setUsersInfo] = useState();
    const [skillsInfo, setSkillsInfo] = useState();
    const userID = "YrAPqt4kT6MYrwjk4U9S4JwdxPC3";
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
        let isMounted = true;
        if (isMounted) {
            firebaseInit.getCollectionData("users", userID).then(data => {
                const isCollect = data.collectCourses?.some(
                    collectCourse => collectCourse === courseID,
                );
                setUserCollection(isCollect);
            });
        }
        return () => {
            isMounted = false;
        };
    }, [courseID]);

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
                        .map(() => ({ reply: "" })),
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
            ]);
            return window.alert("報名成功");
        } catch (error) {
            console.log(error);
            window.alert("發生錯誤，請重新試一次");
        }
    }
    async function handSendMessage() {
        if (!message.trim()) return window.alert("請輸入訊息");

        await updateDoc(doc(firebaseInit.db, "courses", courseData.courseID), {
            askedQuestions: arrayUnion({
                askedContent: message,
                askedDate: new Date(),
                askedUserID: userID,
                replies: [],
            }),
        });
        setMessage("");

        return window.alert("留言已送出");
    }

    function renderMessages() {
        return (
            courseData.askedQuestions &&
            courseData.askedQuestions
                .map((question, index) => (
                    <div key={index} style={{ paddingBottom: 20 }}>
                        <div>
                            {" "}
                            姓名:{" "}
                            {usersInfo &&
                                findUserInfo(question.askedUserID, "name")}
                        </div>
                        <div>內容:{question.askedContent}</div>
                        <div>
                            留言日期:
                            {new Date(
                                question.askedDate.seconds * 1000,
                            ).toLocaleString("TW-zh", { hour12: false })}
                        </div>
                        {question.replies &&
                            question.replies
                                .map((reply, index_2) => (
                                    <div
                                        key={index_2}
                                        style={{
                                            paddingLeft: 50,
                                            marginTop: 10,
                                        }}
                                    >
                                        <div>
                                            姓名:
                                            {usersInfo &&
                                                findUserInfo(
                                                    reply.repliedUserID,
                                                    "name",
                                                )}
                                        </div>
                                        <div>
                                            回覆內容:
                                            {reply.repliedContent}
                                        </div>
                                        <div>
                                            回覆日期:
                                            {new Date(
                                                reply.repliedDate.seconds *
                                                    1000,
                                            ).toLocaleString("TW-zh", {
                                                hour12: false,
                                            })}
                                        </div>
                                    </div>
                                ))
                                .reverse()}
                        <div>
                            <div
                                key={index}
                                style={{
                                    paddingLeft: 50,
                                    marginTop: 10,
                                }}
                            >
                                <Input
                                    value={inputFields[index]?.reply || ""}
                                    name="reply"
                                    onChange={e => handleReplyMessage(e, index)}
                                />
                                <button
                                    onClick={() =>
                                        handleSendReplyMessage(index)
                                    }
                                >
                                    送出
                                </button>
                            </div>
                        </div>
                    </div>
                ))
                .reverse()
        );
    }

    const handleReplyMessage = (e, index) => {
        let data = [...inputFields];
        data[index][e.target.name] = e.target.value;
        setInputFields(data);
    };

    const handleSendReplyMessage = async index => {
        if (!inputFields[index].reply.trim()) return window.alert("請輸入訊息");
        const stateCopy = JSON.parse(JSON.stringify(courseData));
        // const data = { ...courseData };

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

        return window.alert("回覆已送出");
    };

    return (
        <>
            {courseData && usersInfo && (
                <Container>
                    <CourseTitle>{courseData.title}</CourseTitle>
                    <CourseInfo>
                        <InfoTitle>
                            報名人數 {courseData.registrationNumber}
                        </InfoTitle>

                        <InfoTitle>瀏覽人數 {courseData.view}</InfoTitle>
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
                            {findUserInfo(courseData.teacherUserID, "name")}
                        </TeacherName>
                        <TeacherIntroduction>
                            {courseData.teacherIntroduction}
                        </TeacherIntroduction>
                    </TeacherInfo>
                    <Collection
                        onClick={handleCollection}
                        collected={userCollection}
                    >
                        {/* <NewBiTag  viewBox="3 0 24 24"/>{" "} */}
                        {/* <BsBookmark /> */}
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
                                courseData.registrationDeadline.seconds * 1000,
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
                                {skillsInfo && <Skills skills={skillsInfo} />}
                            </FlexDiv>
                        </AboutContentsSkill>
                        <AboutContent>
                            課程詳情
                            <CourseIntroduction>
                                {courseData.courseIntroduction}
                            </CourseIntroduction>
                        </AboutContent>
                    </AboutCourse>

                    <WebButton
                        onClick={handleRegistration}
                        disabled={
                            courseData.teacherUserID === userID ||
                            findUserInfo(userID, "studentsCourses")?.some(
                                value => value === courseID,
                            )
                        }
                        active={
                            courseData.teacherUserID === userID ||
                            findUserInfo(userID, "studentsCourses")?.some(
                                value => value === courseID,
                            )
                        }
                    >
                        {courseData.teacherUserID === userID
                            ? "您是老師喔"
                            : findUserInfo(userID, "studentsCourses")?.some(
                                  value => value === courseID,
                              )
                            ? "你已經報名囉"
                            : "我要報名"}
                    </WebButton>

                    {/* <Div1>
                        <DivTitle>課程名稱</DivTitle>
                        <DivContent>{courseData.title}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>課程介紹</DivTitle>
                        <DivContent>{courseData.courseIntroduction}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>報名截止</DivTitle>
                        <DivContent>
                            {new Date(
                                courseData.registrationDeadline.seconds * 1000,
                            ).toLocaleDateString()}
                        </DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>可獲技能</DivTitle>
                        {skillsInfo && <Skills skills={skillsInfo} />}
                    </Div1>

                    <Div1>
                        <DivTitle>老師簡介</DivTitle>
                        <DivContent>
                            {courseData.teacherIntroduction}
                        </DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>老師姓名</DivTitle>
                        <DivContent>
                            {usersInfo &&
                                findUserInfo(courseData.teacherUserID, "name")}
                        </DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>目前報名人數</DivTitle>
                        <DivContent>{courseData.registrationNumber}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>目前瀏覽人數</DivTitle>
                        <DivContent>{courseData.view}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>收藏</DivTitle>
                        <DivContent onClick={handleCollection}>
                            {userCollection ? "已蒐藏點我取消" : "點我蒐藏"}
                        </DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>留言</DivTitle>
                        <Input
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        <button onClick={handSendMessage}>送出</button>
                    </Div1>
                    <Div1>
                        <DivTitle>留言區</DivTitle>
                        <DivContent
                            style={{
                                flexDirection: "column",
                                paddingBottom: 20,
                            }}
                        >
                            {renderMessages()}
                        </DivContent>
                    </Div1>

                    <Button
                        onClick={handleRegistration}
                        disabled={
                            courseData.teacherUserID === userID ||
                            findUserInfo(userID, "studentsCourses")?.some(
                                value => value === courseID,
                            )
                        }
                        active={
                            courseData.teacherUserID === userID ||
                            findUserInfo(userID, "studentsCourses")?.some(
                                value => value === courseID,
                            )
                        }
                    >
                        {courseData.teacherUserID === userID
                            ? "您是老師喔"
                            : findUserInfo(userID, "studentsCourses")?.some(
                                  value => value === courseID,
                              )
                            ? "你已經報名囉"
                            : "我要報名"}
                    </Button> */}
                </Container>
            )}
            {courseData && usersInfo && (
                <RegisterArea>
                    <Button
                        onClick={handleRegistration}
                        disabled={
                            courseData.teacherUserID === userID ||
                            findUserInfo(userID, "studentsCourses")?.some(
                                value => value === courseID,
                            )
                        }
                        active={
                            courseData.teacherUserID === userID ||
                            findUserInfo(userID, "studentsCourses")?.some(
                                value => value === courseID,
                            )
                        }
                    >
                        {courseData.teacherUserID === userID
                            ? "您是老師喔"
                            : findUserInfo(userID, "studentsCourses")?.some(
                                  value => value === courseID,
                              )
                            ? "你已經報名囉"
                            : "我要報名"}
                    </Button>
                </RegisterArea>
            )}
        </>
    );
};
