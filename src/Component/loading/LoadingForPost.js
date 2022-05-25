import React from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
    height: 1000px;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    position: fixed;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
`;
const Box = styled.div`
    transform: translateX(-40px);
    align-self: flex-start;
    position: absolute;
    top: 250px;
    left: 50%;
`;

const spin = keyframes`
    0% { transform: rotate(0deg) }
    50% { transform: rotate(180deg) }
    100% { transform: rotate(180deg) }
`;

const onOff = keyframes`
    0% { opacity: 0; }
    49% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 1; }

`;

const Area = styled.div`
    height: 20px;
    width: 50px;

    position: absolute;
    animation-duration: 0.8s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-name: ${spin};
`;

const FirstArea = styled(Area)`
    left: 0;
`;

const SecondArea = styled(Area)`
    left: 30px;
    animation-direction: reverse;
`;

const Dot = styled.div`
    animation-duration: 0.8s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #ff6100;
    position: absolute;
`;
const FirstAreaDotA = styled(Dot)`
    left: 0px;
    opacity: 0;
    animation-name: ${onOff};
    animation-direction: reverse;
`;

const FirstAreaDotB = styled(Dot)`
    right: 0px;
`;

const SecondAreaDotA = styled(Dot)`
    left: 0px;
`;

const SecondAreaDotB = styled(Dot)`
    right: 0px;
    animation-name: ${onOff};
`;

const Word = styled.div`
    margin-top: -400px;
    color: whitesmoke;
`;

export const LoadingForPost = () => {
    return (
        <Container>
            <Box>
                <FirstArea>
                    <FirstAreaDotA />
                    <FirstAreaDotB />
                </FirstArea>
                <SecondArea>
                    <SecondAreaDotA />
                    <SecondAreaDotB />
                </SecondArea>
            </Box>
            <Word>資料處理中，請稍後</Word>
        </Container>
    );
};
