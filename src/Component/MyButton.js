import React from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";

const Button = styled.div`
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;

    color: #ffffff;
    font-size: 14px;
    background-color: #ff6100;
    border-radius: 5px;
    cursor: pointer;

    @media ${breakPoint.desktop} {
        width: ${props => props.width || "200px"};
    }
`;

export const MyButton = ({ buttonWord, buttonId, clickFunction, width }) => {
    return (
        <Button onClick={clickFunction} id={buttonId} width={width}>
            {buttonWord}
        </Button>
    );
};
