import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Loading } from "../Component/Loading";
import { Skills } from "../Component/Skills";
import { breakPoint } from "../utils/breakPoint";
import firebaseInit from "../utils/firebase";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;

    @media ${breakPoint.desktop} {
        width: 35%;
        justify-content: space-between;
        margin: auto;
        margin-left: 150px;
        margin-top: -135px;
    }
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const StudentGotSkill = ({ userID }) => {
    const [gotSkills, SetGotSkill] = useState();

    useEffect(() => {
        firebaseInit.getStudentSkills(userID).then(data => {
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
        <>
            {!gotSkills ? (
                <Loading />
            ) : (
                <Container>
                    <Skills skills={gotSkills} />
                </Container>
            )}
        </>
    );
};
