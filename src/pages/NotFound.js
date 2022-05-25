import React from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import notFound from "../images/notFound.jpg";
import MyButton from "../Component/common/MyButton";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    padding: 100px 10px 80px 10px;

    @media ${breakPoint.desktop} {
        margin: auto;
        max-width: 1200px;
    }
`;
const CheckedImg = styled.div`
    margin-top: 50px;
    background-image: url(${notFound});
    background-size: 90%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #5fc198;
    width: 250px;
    height: 250px;
    margin-bottom: 10px;
    border-radius: 50%;
`;

const Text = styled.div`
    width: 100%;
    text-align: center;
    font-size: 16px;
    margin-top: 12px;
    line-height: 1.2;
`;

const ButtonBox = styled.div`
    display: flex;
    width: 100%;
    margin-top: 20px;
    @media ${breakPoint.desktop} {
        width: 200px;
    }
`;

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Container>
            <>
                <CheckedImg />
                <Text>Oooooooopps...</Text>
                <ButtonBox>
                    <MyButton
                        buttonWord="只能回首頁"
                        clickFunction={() => navigate("/")}
                    />
                </ButtonBox>
            </>
        </Container>
    );
};

export default NotFound;
