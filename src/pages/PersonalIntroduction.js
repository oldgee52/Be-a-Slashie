import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import { FiMail } from "react-icons/fi";
import Skills from "../Component/skills/Skills";
import CourseInfo from "../Component/courses/CourseInfo";
import { Loading } from "../Component/loading/Loading";
import { Footer } from "../Component/Footer";
import HoverInfo from "../Component/common/HoverInfo";
import { customDateDisplay } from "../utils/functions";

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
        min-height: calc(100vh - 55px);
        justify-content: flex-start;
    }
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    background: linear-gradient(#ff8f08, #ff6700);
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
    object-fit: cover;
`;

const UserName = styled.div`
    padding-top: 10px;
    font-weight: 700;
    font-size: 20px;
    @media ${breakPoint.desktop} {
        font-size: 24px;
    }
`;

const UserIntroduction = styled.div`
    padding-top: 10px;
    line-height: 1.5;
    word-break: break-all;
`;

const UserSkills = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 10px;
    margin-top: 35px;
    border-radius: 5px;
`;
const SkillTitle = styled.div`
    font-size: 20px;
    width: 100%;
    font-weight: 700;
    border-bottom: 1px solid #7f7f7f;
    padding-bottom: 15px;
    margin-bottom: 20px;
    @media ${breakPoint.desktop} {
        font-size: 24px;
    }
`;

const SkillBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
`;
const CourseBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    @media ${breakPoint.desktop} {
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        &::after {
            content: "";
            width: calc(33.3% - 30px);
        }
    }
`;

const CourseDiv = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        width: calc(33.3% - 30px);
    }
`;

const PersonalIntroduction = () => {
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

    return (
        <>
            {!userInfo || !userSkills || !userFinishCourses ? (
                <Loading />
            ) : (
                <>
                    <Container>
                        <InfoArea>
                            <UserPhoto
                                src={userInfo.photo}
                                alt={userInfo.name}
                            />
                            <UserName>
                                {userInfo.name}{" "}
                                <a href={`mailto: ${userInfo.email}`}>
                                    <HoverInfo content="發送E-mail">
                                        <FiMail viewBox="-1 -1 24 24" />
                                    </HoverInfo>
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
                            <CourseBox>
                                {userFinishCourses.length === 0
                                    ? "還沒有完成的課程QQ"
                                    : userFinishCourses?.map(course => (
                                          <CourseDiv key={course.courseID}>
                                              <CourseInfo
                                                  image={course.image}
                                                  title={course.title}
                                                  teacherName={
                                                      course.teacherName
                                                  }
                                                  closedDate={customDateDisplay(
                                                      course?.courseClosedDate
                                                          .seconds * 1000,
                                                  )}
                                              />
                                          </CourseDiv>
                                      ))}
                            </CourseBox>
                        </UserSkills>
                    </Container>
                    <Footer />
                </>
            )}
        </>
    );
};

export default PersonalIntroduction;
