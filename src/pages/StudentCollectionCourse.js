import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
import { NoDataTitle } from "../Component/NoDataTitle";
import { breakPoint } from "../utils/breakPoint";
import { CourseInfo } from "../Component/CourseInfo";
import { Loading } from "../Component/Loading";
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;

    @media ${breakPoint.desktop} {
        width: 100%;
        justify-content: space-between;
        margin: auto;
        margin-left: 150px;
        margin-top: -135px;
    }
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 10px 0 10px;
    margin-bottom: 100px;
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
        align-items: flex-start;
        &::after {
            content: "";
            width: calc(30% - 10px);
        }
    }
`;

const CourseDiv = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        width: calc(30% - 10px);
        margin-right: 10px;
        margin-bottom: 20px;
    }
`;

export const StudentCollectionCourse = ({ userID }) => {
    const [collectionCourses, SetCollectionCourses] = useState();
    const [usersInfo, setUsersInfo] = useState();

    useEffect(() => {
        if (userID)
            firebaseInit.getStudentCollectCourses(userID).then(data => {
                const validCollectionCourses = data
                    .filter(
                        course =>
                            course.status === 0 &&
                            course.registrationDeadline.seconds >=
                                Math.floor(+new Date() / 1000),
                    )
                    .sort((a, b) => b.openingDate - a.openingDate);

                console.log(validCollectionCourses);

                SetCollectionCourses(validCollectionCourses);
            });
    }, [userID]);

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

    return (
        <>
            {!collectionCourses || !usersInfo ? (
                <Loading />
            ) : (
                <Container>
                    <CourseArea>
                        {collectionCourses.length === 0 ? (
                            <NoDataTitle title="還沒有收藏喔，快去逛逛！" />
                        ) : (
                            collectionCourses.map(course => (
                                <CourseDiv key={course.courseID}>
                                    <CourseInfo
                                        courseID={course.courseID}
                                        teacherPhoto={findUserInfo(
                                            course.teacherUserID,
                                            "photo",
                                        )}
                                        image={course.image}
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
                                </CourseDiv>
                            ))
                        )}
                    </CourseArea>
                </Container>
            )}
        </>
    );
};
