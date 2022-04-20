import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
    cursor: pointer;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
`;

const Div13 = styled(Div1)`
    border: 1px solid black;
    width: 50%;
    height: auto;
`;

const DivContent = styled.div`
    padding-right: 20px;
    width: 100%;
`;

export const StudentCollectionCourse = () => {
    const [collectionCourses, SetCollectionCourses] = useState();
    const [usersInfo, setUsersInfo] = useState();
    const navigate = useNavigate();
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

    useEffect(() => {
        firebaseInit.getStudentCollectCourses(studentID).then(data => {
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
    }, []);

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
        <Container>
            {!collectionCourses ? "loading..." : <Div1>學生收藏課程</Div1>}
            {collectionCourses?.length !== 0
                ? collectionCourses?.map((course, index) => (
                      <Div13
                          key={course.courseID}
                          onClick={() => {
                              navigate(`/course?courseID=${course.courseID}`);
                          }}
                      >
                          <DivContent>
                              項次
                              {index + 1}
                          </DivContent>
                          <DivContent>課程名稱: {course.title}</DivContent>
                          <DivContent>
                              老師: {findUserInfo(course.teacherUserID, "name")}
                              <a
                                  href={`mailto: ${findUserInfo(
                                      course.teacherUserID,
                                      "email",
                                  )}`}
                              >
                                  與我聯繫
                              </a>
                          </DivContent>{" "}
                          <DivContent>
                              開課日期:{" "}
                              {new Date(
                                  course.openingDate.seconds * 1000,
                              ).toLocaleDateString()}
                          </DivContent>
                      </Div13>
                  ))
                : "無課程"}
        </Container>
    );
};
