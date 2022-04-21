import React from "react";
import styled from "styled-components";

const Image = styled.img`
    width: 50px;
    height: 50px;
    margin-left: 25%;
`;

export const Skills = ({ skills }) => {
    return skills && skills.length === 0 ? (
        <div>還沒有獲得技能QQ</div>
    ) : (
        skills?.map(skill => (
            <div key={skill.skillID} style={{ paddingRight: 20 }}>
                <Image src={skill.image} alt={skill.title} />
                <div>{skill.title}</div>
                <div>
                    {new Date(
                        skill.getDate.seconds * 1000,
                    ).toLocaleDateString()}
                </div>
            </div>
        ))
    );
};
