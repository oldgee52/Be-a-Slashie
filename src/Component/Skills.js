import React from "react";
import styled from "styled-components";

const SkillsBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

const Image = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 100%;
`;

const SkillTitle = styled.div`
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
`;
const SkillDate = styled.div`
    font-size: 14px;
    padding: 5px 0;
`;

export const Skills = ({ skills }) => {
    return skills && skills.length === 0 ? (
        <div>還沒有獲得技能QQ</div>
    ) : (
        skills?.map(skill => (
            <SkillsBox key={skill.skillID}>
                <Image src={skill.image} alt={skill.title} />
                <SkillDate>
                    {skill.getDate &&
                        new Date(
                            skill.getDate.seconds * 1000,
                        ).toLocaleDateString()}
                </SkillDate>
                <SkillTitle>{skill.title}</SkillTitle>
            </SkillsBox>
        ))
    );
};
