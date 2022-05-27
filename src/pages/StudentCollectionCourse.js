import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebaseInit from "../utils/firebase";
import breakPoint from "../utils/breakPoint";
import CourseInfo from "../Component/courses/CourseInfo";
import Loading from "../Component/loading/Loading";
import NoDataBox from "../Component/common/NoDataBox";
import { customDateDisplay } from "../utils/functions";
import useUserInfo from "../customHooks/useUserInfo";

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

function StudentCollectionCourse({ userID }) {
    const [collectionCourses, SetCollectionCourses] = useState();
    const [findUserInfo, usersInfo] = useUserInfo();

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

                SetCollectionCourses(validCollectionCourses);
            });
    }, [userID]);

    return !collectionCourses || !usersInfo ? (
        <Loading />
    ) : (
        <Container>
            <CourseArea>
                {collectionCourses.length === 0 ? (
                    <NoDataBox
                        marginTop="20px"
                        marginLeft="150px"
                        title="還沒有收藏喔，快去逛逛！"
                        buttonWord="來去逛逛"
                        path="/search?q=latest"
                    />
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
                                creatDate={customDateDisplay(
                                    course.creatTime.seconds * 1000,
                                )}
                                openingDate={customDateDisplay(
                                    course.openingDate.seconds * 1000,
                                )}
                            />
                        </CourseDiv>
                    ))
                )}
            </CourseArea>
        </Container>
    );
}

StudentCollectionCourse.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default StudentCollectionCourse;
