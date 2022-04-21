import React, { useEffect, useState } from "react";
import { Skills } from "../Component/Skills";
import firebaseInit from "../utils/firebase";
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
    flex-wrap: wrap;
`;
const Div12 = styled(Div1)`
    border: 1px solid black;
`;

const DivContent = styled.div`
    padding-right: 20px;
    width: 100%;
`;
const Div13 = styled(Div1)`
    border: 1px solid black;
    width: 50%;
    height: auto;
`;

export const PersonalIntroduction = () => {
    const [userInfo, setUserInfo] = useState();
    const [userSkills, setUserSkills] = useState();
    const [userFinishCourses, setUserFinishCourses] = useState();

    const uid = new URLSearchParams(window.location.search).get("uid");
    useEffect(() => {
        firebaseInit.getCollectionData("users", uid).then(data => {
            setUserInfo(data);
        });
    }, [uid]);

    useEffect(() => {
        firebaseInit.getStudentSkills(uid).then(data => {
            const rankDecreasingByDate = data.sort(
                (a, b) => a.getDate.seconds - b.getDate.seconds,
            );

            const filterRepeatSkill = rankDecreasingByDate.filter(
                (skill, index, self) =>
                    index === self.findIndex(t => t.skillID === skill.skillID),
            );
            setUserSkills(filterRepeatSkill.reverse());
        });
    }, [uid]);
    useEffect(() => {
        firebaseInit.getStudentRegisteredCourseDetails(uid).then(data => {
            const finishedCourse = data
                .filter(course => {
                    return (
                        course.registrationStatus === 1 &&
                        course.courseStatus === 2
                    );
                })
                .sort(
                    (a, b) =>
                        b.courseClosedDate.seconds - a.courseClosedDate.seconds,
                );

            setUserFinishCourses(finishedCourse);
        });
    }, [uid]);

    console.log(userInfo);
    console.log(userSkills);
    console.log(userFinishCourses);

    return (
        <Container>
            {!userInfo || !userSkills || !userFinishCourses ? (
                "loading..."
            ) : (
                <Div1>
                    <Div12>
                        {
                            <>
                                <img
                                    src={userInfo.photo}
                                    alt={userInfo.name}
                                    width="50"
                                    height="50"
                                />
                                <DivContent>姓名: {userInfo.name}</DivContent>
                                <DivContent>
                                    自我介紹: {userInfo.selfIntroduction}
                                </DivContent>
                                <a href={`mailto: ${userInfo.email}`}>
                                    與我聯繫
                                </a>
                            </>
                        }
                    </Div12>
                    <Div12>
                        <Div1>獲得技能</Div1>
                        <Skills skills={userSkills} />
                    </Div12>
                    <Div12>
                        <Div1>完成課程</Div1>
                        {userFinishCourses.length === 0
                            ? "還沒有完成的課程QQ"
                            : userFinishCourses.map((course, index) => (
                                  <Div13 key={course.courseID}>
                                      <DivContent>
                                          項次
                                          {index + 1}
                                      </DivContent>
                                      <DivContent>
                                          課程名稱: {course.title}
                                      </DivContent>

                                      <DivContent>
                                          完課日期:{" "}
                                          {new Date(
                                              course?.courseClosedDate.seconds *
                                                  1000,
                                          ).toLocaleDateString()}
                                      </DivContent>
                                  </Div13>
                              ))}
                    </Div12>
                </Div1>
            )}
        </Container>
    );
};
