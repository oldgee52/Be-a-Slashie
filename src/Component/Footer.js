import React from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import { FiMail } from "react-icons/fi";

const FooterContainer = styled.footer`
    width: 100%;
    height: 100px;
    background-color: gray;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    color: whitesmoke;
    flex-direction: column;
    @media ${breakPoint.desktop} {
        flex-direction: row;
        justify-content: center;
        margin-top: 10px;
        height: 50px;
    }
`;

const CopyRight = styled.div`
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        margin-top: 0;
        margin-left: 20px;
        margin-right: 20px;
    }
`;
const Title = styled.div`
    margin-top: 20px;
    @media ${breakPoint.desktop} {
        margin-top: 0;
    }
`;
const Contact = styled.a`
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        margin-top: 0;
        margin-top: 1px;
    }
`;

export const Footer = () => {
    return (
        <FooterContainer>
            <Title>Be a Slashie</Title>
            <CopyRight>&copy; 2022 All rights reserved.</CopyRight>
            <Contact href="mailto: beaslashie@gmail.com">
                <span>Contact us</span> <FiMail viewBox="0 -2 24 24" />
            </Contact>
        </FooterContainer>
    );
};
