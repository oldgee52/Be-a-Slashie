import React from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    @media ${breakPoint.desktop} {
        max-width: 1200px;
        justify-content: flex-start;
        padding: 0 20px 0 20px;
    }
`;

const TitleArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;

    @media ${breakPoint.desktop} {
        width: 10%;
        flex-direction: column;
    }
`;

const SubTitleArea = styled(TitleArea)`
    @media ${breakPoint.desktop} {
        flex-direction: row;
        width: 60%;
        justify-content: flex-start;
        align-self: flex-start;

        margin-left: 20px;
    }
`;
const Title = styled.div`
    font-size: 12px;
    text-align: center;
    padding-right: 15px;

    cursor: pointer;

    @media ${breakPoint.desktop} {
        margin-bottom: 30px;
        padding-bottom: 10px;
        border-bottom: 1px solid black;
        padding-right: 0;
    }
`;
const SubTitle = styled(Title)`
    border-left: 1px solid black;
    padding: 0 5px 0 5px;

    &:first-child {
        border-left: none;
    }
    @media ${breakPoint.desktop} {
        padding: 0 10px 0 10px;
        margin-bottom: 0;
        border-bottom: none;
    }
`;
export const Personal = () => {
    return (
        <Container>
            <TitleArea>
                <Title>基本資料</Title>
                <Title>我是學生</Title>
                <Title>我是老師</Title>
            </TitleArea>
            {/* <SubTitleArea>
                <SubTitle>技能徽章</SubTitle>
                <SubTitle>收藏課程</SubTitle>
                <SubTitle>進行中課程</SubTitle>
                <SubTitle>已報名課程</SubTitle>
                <SubTitle>已完成課程</SubTitle>
            </SubTitleArea> */}
            <SubTitleArea>
                <SubTitle>上架課程</SubTitle>
                <SubTitle>尚未開課程</SubTitle>
                <SubTitle>進行中課程</SubTitle>
                <SubTitle>已完成課程</SubTitle>
            </SubTitleArea>
        </Container>
    );
};
