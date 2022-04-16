import React, { Fragment, useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import {
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    increment,
    arrayRemove,
} from "firebase/firestore";
import styled from "styled-components";

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
    const [collection, setCollection] = useState(false);
    const [message, setMessage] = useState("");
    const [inputFields, SetInputFields] = useState([]);
    const userID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

    useEffect(() => {
        const courseID = new URLSearchParams(window.location.search).get(
            "courseID",
        );
        let isMounted = true;

        if (isMounted) {
            firebaseInit.getCourseDetail(courseID).then(data => {
                setCourseData(data);
                console.log(data);

                SetInputFields(
                    Array(data.askedQuestions?.length || 0)
                        .fill()
                        .map(() => ({ reply: "" })),
                );

                //         .fill())
                // SetInputFields(
                //     Array(data.askedQuestions.length)
                //         .fill()
                //         .map(() => ({ input: "" })),
                // );
            });
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const courseID = new URLSearchParams(window.location.search).get(
            "courseID",
        );

        let isMounted = true;
        if (isMounted) {
            firebaseInit.getCollectionData("users", userID).then(data => {
                const isCollect = data.collectCourses.some(
                    collectCourse => collectCourse === courseID,
                );
                setCollection(isCollect);
            });
        }
        return () => {
            isMounted = false;
        };
    }, []);
    function renderSkills() {
        return courseData.skillsData.map(skill => (
            <div key={skill.skillID} style={{ paddingRight: 20 }}>
                <img
                    src={skill.image}
                    alt={skill.title}
                    width="20"
                    heigh="20"
                />
                <div>{skill.title}</div>
            </div>
        ));
    }

    async function handleCollection() {
        if (collection) {
            await updateDoc(doc(firebaseInit.db, "users", userID), {
                collectCourses: arrayRemove(courseData.courseID),
            });
            setCollection(false);
        }
        if (!collection) {
            await updateDoc(doc(firebaseInit.db, "users", userID), {
                collectCourses: arrayUnion(courseData.courseID),
            });
            setCollection(true);
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
            }),
        });
        setMessage("");
        return window.alert("留言已送出");
    }

    const handleReplyMessage = (e, index) => {
        let data = [...inputFields];
        data[index][e.target.name] = e.target.value;
        SetInputFields(data);
    };

    const handleSendReplyMessage = async index => {
        if (!inputFields[index].reply.trim()) return window.alert("請輸入訊息");
        const dataaa = courseData.askedQuestions[0].replies || [];
        dataaa.push({
            repliedContent: inputFields[0].reply,
            repliedDate: new Date(),
            repliedUserID: userID,
        });

        const stateCopy = JSON.parse(JSON.stringify(courseData));

        console.log(stateCopy.askedQuestions[0]);
        console.log(courseData);
        console.log(dataaa);
        // await updateDoc(doc(firebaseInit.db, "courses", courseData.courseID), {
        //     askedQuestions: stateCopy.askedQuestions[0]
        // });

        // setMessage("");
        // return window.alert("留言已送出");
    };

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
                        <DivContent>{renderSkills()}</DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>老師簡介</DivTitle>
                        <DivContent>
                            {courseData.teacherIntroduction}
                        </DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>老師姓名</DivTitle>
                        <DivContent>{courseData.teacherData.name}</DivContent>
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
                            {collection ? "已蒐藏點我取消" : "點我蒐藏"}
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
                            {courseData.askedQuestions?.map(
                                (question, index) => (
                                    <div
                                        key={question.askedDate?.seconds}
                                        style={{ paddingBottom: 20 }}
                                    >
                                        <div> 姓名: {question.askedUserID}</div>
                                        <div>內容:{question.askedContent}</div>
                                        <div>
                                            留言日期:
                                            {new Date(
                                                question.askedDate?.seconds *
                                                    1000,
                                            ).toLocaleDateString()}
                                        </div>
                                        {question.replies &&
                                            question.replies?.map(reply => (
                                                <div
                                                    key={
                                                        reply.repliedDate
                                                            ?.seconds
                                                    }
                                                    style={{
                                                        paddingLeft: 50,
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    <div>
                                                        姓名:
                                                        {reply.repliedUserID}
                                                    </div>
                                                    <div>
                                                        回覆內容:
                                                        {reply.repliedContent}
                                                    </div>
                                                    <div>
                                                        回覆日期:
                                                        {new Date(
                                                            reply.repliedDate
                                                                .seconds * 1000,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        <div>
                                            <div
                                                key={index}
                                                style={{
                                                    paddingLeft: 50,
                                                    marginTop: 10,
                                                }}
                                            >
                                                <Input
                                                    value={
                                                        inputFields[index]
                                                            ?.reply || ""
                                                    }
                                                    name="reply"
                                                    onChange={e =>
                                                        handleReplyMessage(
                                                            e,
                                                            index,
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleSendReplyMessage(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    送出
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                            <></>
                        </DivContent>
                    </Div1>

                    <Button onClick={handleRegistration}>我要報名</Button>
                </Container>
            )}
        </>
    );
};
