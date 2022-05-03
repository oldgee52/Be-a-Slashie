import React from "react";
import styled from "styled-components";

const SkillName = styled.label`
    font-size: 14px;
    min-width: 100px;
    margin: 10px 0;
    display: flex;
`;
const SkillNameLabel = styled.div`
    padding-left: 5px;
    cursor: pointer;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
    cursor: pointer;
`;

export const CheckSkills = ({ skillID, handleSkillChange, title }) => {
    return (
        <SkillName htmlFor={skillID}>
            <CheckBox
                type="checkbox"
                value={skillID}
                key={skillID}
                id={skillID}
                name="skills"
                onClick={handleSkillChange}
            />
            <SkillNameLabel>{title}</SkillNameLabel>
        </SkillName>
    );
};
