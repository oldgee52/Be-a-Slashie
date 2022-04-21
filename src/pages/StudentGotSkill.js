import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Skills } from "../Component/Skills";
import firebaseInit from "../utils/firebase";

const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const Image = styled.img`
    width: 50px;
    height: 50px;
    margin-left: 25%;
`;

export const StudentGotSkill = () => {
    const [gotSkills, SetGotSkill] = useState();
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

    useEffect(() => {
        firebaseInit.getStudentSkills(studentID).then(data => {
            console.log(data);
            const rankDecreasingByDate = data.sort(
                (a, b) => a.getDate.seconds - b.getDate.seconds,
            );

            const filterRepeatSkill = rankDecreasingByDate.filter(
                (skill, index, self) =>
                    index === self.findIndex(t => t.skillID === skill.skillID),
            );
            SetGotSkill(filterRepeatSkill.reverse());
        });
    }, []);
    return (
        <Container>
            {!gotSkills ? "loading..." : <Div1>獲得技能</Div1>}
            {gotSkills && <Skills skills={gotSkills} />}
        </Container>
    );
};
