import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Loading } from "../Component/Loading";
import { Skills } from "../Component/Skills";
import { breakPoint } from "../utils/breakPoint";
import firebaseInit from "../utils/firebase";
import { NoDataBox } from "../Component/NoDataBox";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;

    @media ${breakPoint.desktop} {
        width: 35%;
        justify-content: flex-start;
        margin: auto;
        margin-left: 150px;
        margin-top: -135px;
    }
`;

export const StudentGotSkill = ({ userID }) => {
    const [gotSkills, SetGotSkill] = useState();

    useEffect(() => {
        if (userID)
            firebaseInit.getStudentSkills(userID).then(data => {
                const rankDecreasingByDate = data.sort(
                    (a, b) => a.getDate.seconds - b.getDate.seconds,
                );

                const filterRepeatSkill = rankDecreasingByDate.filter(
                    (skill, index, self) =>
                        index ===
                        self.findIndex(t => t.skillID === skill.skillID),
                );
                SetGotSkill(filterRepeatSkill.reverse());
            });
    }, [userID]);
    return (
        <>
            {!gotSkills ? (
                <Loading />
            ) : (
                <Container>
                    {gotSkills.length === 0 ? (
                        <NoDataBox
                            marginTop="20px"
                            marginLeft="150px"
                            title="還沒有獲得徽章，快去逛逛！"
                            buttonWord="來去逛逛"
                            path="/search?q=latest"
                        />
                    ) : (
                        <Skills skills={gotSkills} />
                    )}
                </Container>
            )}
        </>
    );
};
