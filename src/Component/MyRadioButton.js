import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { breakPoint } from "../utils/breakPoint";

const InputLabel = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;

    cursor: pointer;
`;

const Agreement = styled.div`
    margin-left: 15px;
`;

const Radio = styled.span`
    border: 1px solid #707070;
    height: 15px;
    width: 15px;
    background-color: white;
    border-radius: 100%;
    margin-top: 1px;

    transition: all 0.2s ease;
    &::after {
        content: "";
        position: absolute;
        display: none;
        top: 1.2px;
        left: 1.5px;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: #00bea4;
        @media ${breakPoint.desktop} {
            top: 1.5px;
            left: 1.5px;
        }
    }
`;

const RadioButton = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    &:checked + ${Radio} {
        background-color: white;
        border-color: #00bea4;
        &::after {
            display: block;
        }
    }
`;
export const MyRadioButton = ({
    inputId,
    inputName,
    inputValue,
    changeFunction,
    title,
}) => {
    return (
        <InputLabel htmlFor={inputId}>
            <RadioButton
                type="radio"
                id={inputId}
                name={inputName}
                value={inputValue}
                onChange={e => {
                    changeFunction(e);
                }}
            />
            <Radio />
            <Agreement>{title}</Agreement>
        </InputLabel>
    );
};

MyRadioButton.prototype = {
    inputId: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    inputValue: PropTypes.number.isRequired,
    changeFunction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};
