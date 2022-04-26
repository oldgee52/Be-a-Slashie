import React from "react";
import styled from "styled-components";

const Label = styled.label`
    display: flex;
    width: 100%;
    margin-bottom: 16px;

    @media (max-width: 992px) {
        flex-wrap: wrap;
    }
`;

const FormDiv = styled.div`
    width: 104px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
`;

const Input = styled.input`
    width: 100%;
    height: 40px;
`;

export const TextInput = ({ title, value, handleChange, name, type }) => {
    return (
        <Label>
            <FormDiv>{title}</FormDiv>
            <Input
                type={type || "text"}
                value={value}
                onChange={e => handleChange(e)}
                name={name}
            />
        </Label>
    );
};
