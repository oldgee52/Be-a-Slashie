import React from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";

const Button = styled.button`
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;

    color: #ffffff;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;

    background-color: ${props => (props.disabled ? "gray" : "#ff6100")};
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};

    @media ${breakPoint.desktop} {
        width: ${props => props.width || "200px"};
    }
`;

export const MyButton = ({
    buttonWord,
    buttonId,
    clickFunction,
    width,
    isDisabled,
}) => {
    return (
        <Button
            onClick={clickFunction}
            id={buttonId}
            width={width}
            disabled={isDisabled}
        >
            {buttonWord}
        </Button>
    );
};
