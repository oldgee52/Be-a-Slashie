import React, { useEffect, useState } from "react";
import { CourseInfo } from "../Component/CourseInfo";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "../Component/SearchInput";
import { breakPoint } from "../utils/breakPoint";
import { Loading } from "../Component/Loading";
import { Footer } from "../Component/Footer";
import banner from "../images/banner.png";
import { FaArrowRight } from "react-icons/fa";
import { keyframes } from "styled-components";
import { customDateDisplay } from "../utils/functions";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;

    @media ${breakPoint.desktop} {
        max-width: 1200px;
    }
`;

const Banner = styled.div`
    width: 100%;
    height: 500px;
    background-image: url(${banner});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: left;

    display: flex;
    flex-direction: column;
    align-items: center;

    @media ${breakPoint.desktop} {
        background-position: initial;
    }
`;

const Title = styled.h2`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 70%;
    font-size: 20px;
    @media ${breakPoint.desktop} {
        font-size: 28px;
        margin-bottom: 40px;
    }
`;

const move = keyframes`
    0%{
        transform: translateX(0%);
    }
    50% {
        transform: translateX(-10%);
    }
    100% {
        transform: translateX(0%);
    }
    

`;
const SeeMore = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 30%;
    text-align: right;
    font-size: 14px;
    animation: ${move} 3s infinite ease-in-out;
    cursor: pointer;

    @media ${breakPoint.desktop} {
        font-size: 16px;
        padding-top: 10px;
        margin-bottom: 40px;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const InputArea = styled.div`
    top: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    @media ${breakPoint.desktop} {
        max-width: 1200px;
        justify-content: flex-start;
    }
`;
const BannerTitle = styled.div`
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    width: 100%;
    margin-bottom: 20px;
    line-height: 1.5;

    @media ${breakPoint.desktop} {
        font-size: 28px;
        text-align: left;
        padding-left: 20px;
    }
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 10px 0 10px;
    margin-bottom: 100px;
    align-self: flex-end;

    @media ${breakPoint.desktop} {
        justify-content: space-between;
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

const InputDiv = styled.div`
    width: 95%;

    @media ${breakPoint.desktop} {
        width: 30%;
        padding-left: 20px;
    }
`;

export const Home = () => {
    const [latestCourse, setLatestCourse] = useState();
    const [popularCourse, setPopularCourse] = useState();
    const [searchField, setSearchField] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        let isMounted = true;

        firebaseInit.getRegisteringCourse().then(data => {
            const orderByCreatTimeTopThree = data
                .sort((a, b) => b.creatTime.seconds - a.creatTime.seconds)
                .slice(0, 3);

            const orderByViewTopThree = data
                .sort((a, b) => b.view - a.view)
                .slice(0, 3);

            if (isMounted) {
                setLatestCourse(orderByCreatTimeTopThree);
                setPopularCourse(orderByViewTopThree);
            }

            return () => (isMounted = false);
        });
    }, []);

    return (
        <>
            {!latestCourse || !popularCourse ? (
                <Loading />
            ) : (
                <>
                    <Banner>
                        <InputArea>
                            <BannerTitle>
                                夢想，不是浮躁
                                <br />
                                而是沈澱和累積
                            </BannerTitle>
                            <InputDiv>
                                <SearchInput
                                    searchField={searchField}
                                    setSearchField={setSearchField}
                                    changeValueCallback={e => {
                                        e.preventDefault();
                                        setSearchField(e.target.value);
                                    }}
                                    searchCallback={e => {
                                        e.preventDefault();
                                        if (!searchField.trim()) return;
                                        navigate(
                                            `/search?q=${searchField.trim()}`,
                                        );
                                    }}
                                    placeholderText="今天想要學習什麼呢..."
                                />
                            </InputDiv>
                        </InputArea>
                    </Banner>
                    <Container>
                        <>
                            <CourseArea>
                                <Title>最新上架</Title>
                                <SeeMore
                                    onClick={() => navigate(`/search?q=latest`)}
                                >
                                    點我看更多{" "}
                                    <span>
                                        <FaArrowRight />
                                    </span>
                                </SeeMore>

                                {latestCourse.map(course => (
                                    <CourseDiv key={course.courseID}>
                                        <CourseInfo
                                            teacherPhoto={
                                                course.teacherInfo.photo
                                            }
                                            image={course.image}
                                            courseID={course.courseID}
                                            title={course.title}
                                            teacherName={
                                                course.teacherInfo.name
                                            }
                                            view={course.view}
                                            label={"最新"}
                                            creatDate={customDateDisplay(
                                                course.creatTime.seconds * 1000,
                                            )}
                                            openingDate={customDateDisplay(
                                                course.openingDate.seconds *
                                                    1000,
                                            )}
                                        />
                                    </CourseDiv>
                                ))}
                            </CourseArea>
                            <CourseArea>
                                <Title>熱門課程</Title>
                                <SeeMore
                                    onClick={() =>
                                        navigate(`/search?q=popular`)
                                    }
                                >
                                    點我看更多{" "}
                                    <span>
                                        <FaArrowRight />
                                    </span>
                                </SeeMore>

                                {popularCourse.map(course => (
                                    <CourseDiv key={course.courseID}>
                                        <CourseInfo
                                            teacherPhoto={
                                                course.teacherInfo.photo
                                            }
                                            image={course.image}
                                            courseID={course.courseID}
                                            title={course.title}
                                            teacherName={
                                                course.teacherInfo.name
                                            }
                                            view={course.view}
                                            label={"熱門"}
                                            creatDate={customDateDisplay(
                                                course.creatTime.seconds * 1000,
                                            )}
                                            openingDate={customDateDisplay(
                                                course.openingDate.seconds *
                                                    1000,
                                            )}
                                        />
                                    </CourseDiv>
                                ))}
                            </CourseArea>
                        </>
                    </Container>
                    <Footer />
                </>
            )}
        </>
    );
};
