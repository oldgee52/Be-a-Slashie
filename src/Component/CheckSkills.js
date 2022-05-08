import React, { useState } from "react";
import styled from "styled-components";
import { BsCheck } from "react-icons/bs";

const SkillName = styled.label`
    font-size: 14px;
    min-width: 100px;
    margin: 10px 0;
    display: flex;
    cursor: pointer;
`;
const SkillNameLabel = styled.div`
    padding-left: 5px;
    height: 13px;
    line-height: 13px;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
    display: none;
`;
const MyCheckBox = styled.div`
    width: 13px;
    height: 13px;
    border: 1px solid ${props => (props.checked ? "#00e0b6" : "#707070")};
    border-radius: 2px;
    background: ${props => (props.checked ? "#00e0b6" : "white")};
    transition: all 0.2s ease;
`;
const NewBsCheck = styled(BsCheck)`
    width: 13px;
    height: 13px;
    color: white;
`;

export const CheckSkills = ({ skillID, handleSkillChange, title }) => {
    const [isChecked, setIsChecked] = useState(false);
    console.log(isChecked);
    return (
        <SkillName
            htmlFor={skillID}
            onChange={() => {
                setIsChecked(!isChecked);
            }}
        >
            <CheckBox
                type="checkbox"
                value={skillID}
                key={skillID}
                id={skillID}
                name="skills"
                onClick={handleSkillChange}
            />
            <MyCheckBox checked={isChecked}>
                <NewBsCheck viewBox="3 3 12 12" />
            </MyCheckBox>
            <SkillNameLabel>{title}</SkillNameLabel>
        </SkillName>
    );
};
