import React from "react";
import styled from "styled-components";
import { useCustomDateDisplay } from "../customHooks/useCustomDateDisplay";
import { breakPoint } from "../utils/breakPoint";

const SkillsBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    width: 120px;
`;

const Image = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 100%;
`;

const SkillTitle = styled.div`
    font-size: 16px;
    letter-spacing: 2px;
`;
const SkillDate = styled.div`
    font-size: 12px;
    padding: 5px 0;
`;

export const Skills = ({ skills }) => {
    const customDateDisplay = useCustomDateDisplay();
    return skills && skills.length === 0 ? (
        <div>還沒有獲得技能QQ</div>
    ) : (
        skills?.map(skill => (
            <SkillsBox key={skill.skillID}>
                <Image src={skill.image} alt={skill.title} />
                <SkillDate>
                    {skill.getDate &&
                        customDateDisplay(skill.getDate.seconds * 1000)}
                </SkillDate>
                <SkillTitle>{skill.title}</SkillTitle>
            </SkillsBox>
        ))
    );
};
