import React, { useEffect, useState } from "react";
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
import { async } from "@firebase/util";

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
    margin-top: 20px;
`;

const DivTitle = styled.div`
    width: 20%;
`;
const DivContent = styled.div`
    width: 80%;
    display: flex;
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

export const Course = () => {
    const [courseData, setCourseData] = useState();
    const [collection, setCollection] = useState(false);
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
                    <Button onClick={handleRegistration}>我要報名</Button>
                </Container>
            )}
        </>
    );
};
