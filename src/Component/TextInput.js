import React from "react";
import styled from "styled-components";

const Label = styled.label`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const FormDiv = styled.div`
    height: 40px;
    line-height: 40px;
    font-size: 16px;
`;

const Input = styled.input`
    width: 100%;
    height: 40px;

    padding: 10px;
    border-radius: 10px;
`;

export const TextInput = ({
    title,
    value,
    handleChange,
    name,
    type,
    placeholder,
}) => {
    return (
        <Label>
            {title && <FormDiv>{title}</FormDiv>}
            <Input
                type={type || "text"}
                value={value}
                onChange={handleChange}
                name={name}
                placeholder={placeholder}
            />
        </Label>
    );
};
