import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import breakPoint from "../../utils/breakPoint";

const Label = styled.label`
    display: flex;
    flex-direction: column;
    width: 100%;
    @media ${breakPoint.desktop} {
        flex-direction: row;
    }
`;

const FormDiv = styled.div`
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    @media ${breakPoint.desktop} {
        width: 20%;
    }
`;

const Input = styled.input`
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid #7f7f7f;
    &::placeholder {
        font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
        letter-spacing: 1px;
        font-weight: 500;
    }
    &:focus {
        outline: none;
    }
    @media ${breakPoint.desktop} {
        flex: 1 0;
    }
`;

function TextInput({ title, value, handleChange, name, type, placeholder }) {
    return (
        <Label>
            {title && <FormDiv>{title}</FormDiv>}
            <Input
                type={type}
                value={value}
                onChange={e => handleChange(e)}
                name={name}
                placeholder={placeholder}
            />
        </Label>
    );
}

TextInput.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
};

TextInput.defaultProps = {
    title: "",
    type: "text",
    placeholder: "",
};

export default TextInput;
