import React, { useEffect, useState } from "react";
import { CourseInfo } from "../Component/CourseInfo";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "../Component/SearchInput";
import { breakPoint } from "../utils/breakPoint";

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
    background-color: #ff6100;
`;

const Title = styled.h2`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 70%;
    @media ${breakPoint.desktop} {
        font-size: 32px;
        margin-bottom: 40px;
    }
`;
const SeeMore = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 30%;
    text-align: right;

    cursor: pointer;

    @media ${breakPoint.desktop} {
        font-size: 24px;
        padding-top: 10px;
        margin-bottom: 40px;
    }
`;

const InputArea = styled.div`
    top: 250px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    @media ${breakPoint.desktop} {
        top: 200px;
    }
`;
const BannerTitle = styled.div`
    font-size: 20px;
    color: black;
    font-weight: 700;
    text-align: center;
    flex: 1 0 100%;
    margin-bottom: 20px;

    @media ${breakPoint.desktop} {
        text-align: left;
        padding-left: 10%;
    }
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 10px 0 10px;
    margin-bottom: 100px;

    @media ${breakPoint.desktop} {
        justify-content: space-between;
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

    return (
        <>
            <Banner>
                <InputArea>
                    <BannerTitle>今晚要來點什麼?</BannerTitle>
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
                            navigate(`/search?q=${searchField.trim()}`);
                        }}
                    />
                </InputArea>
            </Banner>
            <Container>
                {!latestCourse || !popularCourse ? (
                    "loading..."
                ) : (
                    <>
                        <CourseArea>
                            <Title>最新上架</Title>
                            <SeeMore
                                onClick={() => navigate(`/search?q=latest`)}
                            >
                                點我看更多
                            </SeeMore>

                            {latestCourse.map(course => (
                                <CourseInfo
                                    key={course.courseID}
                                    teacherPhoto={course.teacherInfo.photo}
                                    image={course.image}
                                    courseID={course.courseID}
                                    title={course.title}
                                    teacherName={course.teacherInfo.name}
                                    view={course.view}
                                    creatDate={new Date(
                                        course.creatTime.seconds * 1000,
                                    ).toLocaleDateString()}
                                    openingDate={new Date(
                                        course.openingDate.seconds * 1000,
                                    ).toLocaleDateString()}
                                />
                            ))}
                        </CourseArea>
                        <CourseArea>
                            <Title>熱門課程</Title>
                            <SeeMore
                                onClick={() => navigate(`/search?q=popular`)}
                            >
                                點我看更多
                            </SeeMore>

                            {popularCourse.map(course => (
                                <CourseInfo
                                    key={course.courseID}
                                    teacherPhoto={course.teacherInfo.photo}
                                    image={course.image}
                                    courseID={course.courseID}
                                    title={course.title}
                                    teacherName={course.teacherInfo.name}
                                    view={course.view}
                                    creatDate={new Date(
                                        course.creatTime.seconds * 1000,
                                    ).toLocaleDateString()}
                                    openingDate={new Date(
                                        course.openingDate.seconds * 1000,
                                    ).toLocaleDateString()}
                                />
                            ))}
                        </CourseArea>
                    </>
                )}
            </Container>
        </>
    );
};
