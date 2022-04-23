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

const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    margin-top: 20px;
`;

const DivTitle = styled.div`
    width: 20%;
`;
const DivContent = styled.div`
    width: 80%;
    display: flex;
`;

const Input = styled.input`
    width: 50%;
    height: 20px;
`;

const Button = styled.button`
    width: 100%;
    height: 48px;
    text-align: center;
    margin-top: 20px;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background-color: #f44336;
    border: none;
    cursor: pointer;
`;

export const Course = () => {
    const [courseData, setCourseData] = useState();
    const [userCollection, setUserCollection] = useState(false);
    const [message, setMessage] = useState("");
    const [inputFields, setInputFields] = useState([]);
    const [usersInfo, setUsersInfo] = useState();
    const [skillsInfo, setSkillsInfo] = useState();
    const userID = "WBKPGMSAejc9AHYGqROpDZWWTz23";
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
                const isCollect = data.collectCourses.some(
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

    console.log(skillsInfo);

    return (
        <>
            {courseData && (
                <Container>
                    <Div1>
                        <DivTitle>課程名稱</DivTitle>
                        <DivContent>{courseData.title}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>課程介紹</DivTitle>
                        <DivContent>{courseData.courseIntroduction}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>報名截止日</DivTitle>
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

                    <Button onClick={handleRegistration}>我要報名</Button>
                </Container>
            )}
        </>
    );
};
