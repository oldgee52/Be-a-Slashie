import React from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
`;
const Box = styled.div`
    transform: translateX(-35px);
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

//   .duo {
//     height: 20px;
//     width: 50px;
//     background: hsla(0, 0%, 0%, 0.0);
//     position: absolute;

//   }

//   .duo, .dot {
//     animation-duration: 0.8s;
//     animation-timing-function: ease-in-out;
//     animation-iteration-count: infinite;

//   }

//   .duo1 {
//     left: 0;
//     animation-name: spin;
//   }

//   .duo2 {
//     left: 30px
//   }

//   .dot {
//     width: 20px;
//     height: 20px;
//     border-radius: 10px;
//     background: #333;
//     position: absolute;
//   }

//   .dot-a {
//     left: 0px;
//   }

//   .dot-b {
//     right: 0px;
//   }

//   .duo1 {
//     animation-name: spin;
//   }

//   .duo2 {
//     animation-name: spin;
//     animation-direction: reverse;
//   }

//   .duo2 .dot-b {
//     animation-name: onOff;
//   }

//   .duo1 .dot-a {
//     opacity: 0;
//     animation-name: onOff;
//     animation-direction: reverse;
//   }

export const Loading = () => {
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
        </Container>
    );
};
