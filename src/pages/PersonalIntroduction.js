import React, { useEffect, useState } from "react";
import { Skills } from "../Component/Skills";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import { FiMail } from "react-icons/fi";
import { CourseInfo } from "../Component/CourseInfo";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    padding: 80px 10px 80px 10px;

    @media ${breakPoint.desktop} {
        margin: auto;
        max-width: 1200px;
    }
`;

const Background = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    background-color: gray;
    border: 1px solid white;
    border-radius: 5px;
    color: white;

    min-height: 150px;

    padding: 10px;
    padding-top: 80px;
`;
const UserPhoto = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 100%;

    position: absolute;
    top: -20px;
    left: 20px;

    border: 2px solid white;
`;

const UserName = styled.div`
    padding-top: 10px;
    font-weight: 700;
    font-size: 20px;
`;

const UserIntroduction = styled.div`
    padding-top: 10px;
    line-height: 1.5;
`;

const UserSkills = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    background-color: white;
    min-height: 200px;
    padding: 10px;

    margin-top: 35px;

    border: 1px solid white;
    border-radius: 5px;
`;
const SkillTitle = styled.div`
    font-size: 20px;
    width: 100%;
    font-weight: 700;
`;

const SkillBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const CourseDiv = styled.div`
    width: 100%;
    /* margin-top: 20px; */

    @media ${breakPoint.desktop} {
        width: calc(33.3% - 30px);
    }
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
            // console.log(data)
            const finishedCourse = data.filter(course => {
                return (
                    course.registrationStatus === 1 && course.courseStatus === 2
                );
            });

            const orderByClosedDate = finishedCourse.sort(
                (a, b) =>
                    b.courseClosedDate.seconds - a.courseClosedDate.seconds,
            );

            setUserFinishCourses(orderByClosedDate);
        });
    }, [uid]);

    console.log(userFinishCourses);

    return (
        <Background>
            <Container>
                {!userInfo || !userSkills || !userFinishCourses ? (
                    "loading..."
                ) : (
                    <>
                        <InfoArea>
                            <UserPhoto
                                src={userInfo.photo}
                                alt={userInfo.name}
                            />
                            <UserName>
                                {userInfo.name}{" "}
                                <a href={`mailto: ${userInfo.email}`}>
                                    <FiMail />
                                </a>
                            </UserName>{" "}
                            <UserIntroduction>
                                {userInfo.selfIntroduction}
                            </UserIntroduction>
                        </InfoArea>
                        <UserSkills>
                            <SkillTitle>獲得技能</SkillTitle>
                            <SkillBox>
                                <Skills skills={userSkills} />
                            </SkillBox>
                        </UserSkills>
                        <UserSkills>
                            <SkillTitle>完成課程</SkillTitle>
                            {userFinishCourses.length === 0
                                ? "還沒有完成的課程QQ"
                                : userFinishCourses.map((course, index) => (
                                      <CourseDiv key={course.courseID}>
                                          <CourseInfo
                                              image={course.image}
                                              title={course.title}
                                              teacherName={course.teacherName}
                                              closedDate={new Date(
                                                  course?.courseClosedDate
                                                      .seconds * 1000,
                                              ).toLocaleDateString()}
                                          />
                                      </CourseDiv>
                                  ))}
                        </UserSkills>
                    </>
                )}
            </Container>
        </Background>
    );
};
