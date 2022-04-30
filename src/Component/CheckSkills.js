import React from "react";
import styled from "styled-components";

const SkillName = styled.div`
    font-size: 14px;
    min-width: 100px;
    margin: 10px 0;
`;
const SkillNameLabel = styled.label`
    padding-left: 5px;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })``;

export const CheckSkills = ({ skillID, handleSkillChange, title }) => {
    return (
        <SkillName>
            <CheckBox
                type="checkbox"
                value={skillID}
                key={skillID}
                id={skillID}
                name="skills"
                onClick={handleSkillChange}
            />
            <SkillNameLabel htmlFor={skillID}>{title}</SkillNameLabel>
        </SkillName>
    );
};
