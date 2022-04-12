import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import {
    getDoc,
    doc,
    addDoc,
    collection,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import styled from "styled-components";

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
`;

const DivTitle = styled.div`
    width: 20%;
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

export const Course = () => {
    const [courseData, setCourseData] = useState();
    useEffect(() => {
        let isMounted = true;
        (async function (db) {
            const courseDocRef = doc(db, "courses", "9jGrfPVw6FhT5WSLWZVw");
            const coursesSnapshot = await getDoc(courseDocRef);

            if (coursesSnapshot.exists()) {
                if (isMounted) {
                    console.log(coursesSnapshot.data());
                    setCourseData(coursesSnapshot.data());
                    await updateDoc(courseDocRef, {
                        view: coursesSnapshot.data().view + 1,
                    });
                }
            }
        })(firebaseInit.db);
        return () => {
            isMounted = false;
        };
    }, []);

    async function handleRegistration(e) {
        e.preventDefault();

        try {
            await Promise.all([
                addDoc(
                    collection(
                        firebaseInit.db,
                        "courses",
                        courseData.courseID,
                        "students",
                    ),
                    {
                        teacherUserID: courseData.teacherUserID,
                        courseID: courseData.courseID,
                        registrationStatus: "pending",
                    },
                ),
                updateDoc(
                    doc(
                        firebaseInit.db,
                        "users",
                        "QptFGccbXGVyiTwmvxFG07JNbjp1",
                    ),
                    {
                        studentsCourses: arrayUnion(courseData.courseID),
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
                                courseData.registrationDeadline,
                            ).toDateString()}
                        </DivContent>
                    </Div1>
                    <Div1>
                        <DivTitle>可獲技能</DivTitle>
                        <DivContent>
                            {courseData.getSkills.map(skill => (
                                <div key={skill}>{skill}</div>
                            ))}
                        </DivContent>
                    </Div1>
                    <Button onClick={handleRegistration}>我要報名</Button>
                </Container>
            )}
        </>
    );
};
