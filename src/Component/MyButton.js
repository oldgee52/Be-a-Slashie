import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { breakPoint } from "../utils/breakPoint";

const Button = styled.button`
    width: ${props => props.width || "100%"};
    height: 40px;
    text-align: center;
    line-height: 40px;
    letter-spacing: 1px;

    color: white;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;

    background: ${props =>
        props.disabled
            ? "gray"
            : "linear-gradient(to left,#ff8f08 -10.47%,#ff6700 65.84%)"};
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};

    @media ${breakPoint.desktop} {
        width: ${props => props.width || "200px"};
    }
`;

const MyButton = ({
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

MyButton.propTypes = {
    buttonWord: PropTypes.string.isRequired,
    buttonId: PropTypes.string,
    clickFunction: PropTypes.func.isRequired,
    width: PropTypes.string,
    isDisabled: PropTypes.bool,
};

export default MyButton;
