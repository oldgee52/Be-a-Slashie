import React, { useEffect, useState } from "react";
import { CourseInfo } from "../Component/CourseInfo";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "../Component/SearchInput";
import { breakPoint } from "../utils/breakPoint";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
`;

const Banner = styled.div`
    width: 100%;
    height: 500px;
    background-color: #ff6100;
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
            {/* <Container>
                {!latestCourse || !popularCourse ? (
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
                                    teacherName={course.teacherInfo.name}
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
                                    teacherName={course.teacherInfo.name}
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
            </Container> */}
        </>
    );
};
