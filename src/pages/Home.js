import React, { useEffect, useState } from "react";
import { CourseInfo } from "../Component/CourseInfo";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 1000px;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
`;
const Title = styled.h2`
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const DivFlex = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const Home = () => {
    const [latestCourse, setLatestCourse] = useState();
    const [popularCourse, setPopularCourse] = useState();
    const [usersInfo, setUsersInfo] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        let isMounted = true;

        firebaseInit.getRegisteringCourse().then(data => {
            console.log(data);
            const orderByCreatTimeTopThree = data
                .sort((a, b) => b.creatTime.seconds - a.creatTime.seconds)
                .slice(0, 3);

            const orderByViewTopThree = data
                .sort((a, b) => b.view - a.view)
                .slice(0, 3);
            console.log("時間排序", orderByCreatTimeTopThree);
            console.log("觀看次數排序", orderByViewTopThree);
            if (isMounted) {
                setLatestCourse(orderByCreatTimeTopThree);
                setPopularCourse(orderByViewTopThree);
            }

            return () => (isMounted = false);
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        firebaseInit
            .getCollection(collection(firebaseInit.db, "users"))
            .then(data => {
                if (isMounted) setUsersInfo(data);
            });
        return () => (isMounted = false);
    }, []);

    function findUserInfo(userID, info) {
        const result = usersInfo.filter(array => array.uid === userID);

        return result[0][info];
    }

    return (
        <Container>
            {!latestCourse || !popularCourse || !usersInfo ? (
                "loading..."
            ) : (
                <Div1>
                    <Title>最新上架</Title>
                    <DivFlex>
                        {latestCourse.map(course => (
                            <CourseInfo
                                key={course.courseID}
                                courseID={course.courseID}
                                title={course.title}
                                teacherName={findUserInfo(
                                    course.teacherUserID,
                                    "name",
                                )}
                                creatDate={new Date(
                                    course.creatTime.seconds * 1000,
                                ).toLocaleDateString()}
                                openingDate={new Date(
                                    course.openingDate.seconds * 1000,
                                ).toLocaleDateString()}
                            />
                        ))}
                    </DivFlex>
                    <button onClick={() => navigate(`/search?q=latest`)}>
                        點我看更多
                    </button>
                    <Title>熱門課程</Title>
                    <DivFlex>
                        {popularCourse.map(course => (
                            <CourseInfo
                                key={course.courseID}
                                courseID={course.courseID}
                                title={course.title}
                                teacherName={findUserInfo(
                                    course.teacherUserID,
                                    "name",
                                )}
                                openingDate={new Date(
                                    course.openingDate.seconds * 1000,
                                ).toLocaleDateString()}
                                view={course.view}
                            />
                        ))}
                    </DivFlex>
                    <button onClick={() => navigate(`/search?q=popular`)}>
                        點我看更多
                    </button>
                </Div1>
            )}
        </Container>
    );
};
