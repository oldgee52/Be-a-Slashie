import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { BsCheck } from "react-icons/bs";

const SkillName = styled.label`
    font-size: 14px;
    min-width: 100px;
    margin: 10px 0;
    display: flex;

    cursor: pointer;
`;
const SkillNameLabel = styled.span`
    padding-left: 5px;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
    display: none;
`;
const MyCheckBox = styled.div`
    width: 12px;
    height: 12px;
    border: 1px solid ${props => (props.checked ? "#00bea4" : "#707070")};
    border-radius: 2px;
    background: ${props => (props.checked ? "#00bea4" : "white")};
    transition: all 0.2s ease;
    margin-top: 1.8px;
`;
const NewBsCheck = styled(BsCheck)`
    width: 13px;
    height: 13px;
    color: white;
`;

function CheckSkills({ skillID, handleSkillChange, title }) {
    const [isChecked, setIsChecked] = useState(false);
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
}

CheckSkills.propTypes = {
    skillID: PropTypes.string.isRequired,
    handleSkillChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default CheckSkills;
