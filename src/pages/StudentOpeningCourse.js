import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";

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
`;

const Div12 = styled(Div1)`
    border: 1px solid black;
`;

const DivCourse = styled.h3`
    width: 100%;
`;

const DivContent = styled.div`
    padding-right: 20px;
`;

const Button = styled.button`
    width: 100%;
    height: 48px;
    text-align: center;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background-color: #f44336;
    border: none;
    cursor: pointer;
`;

export const StudentOpeningCourse = () => {
    const [courseDetails, setCourseDetails] = useState();
    useEffect(() => {
        const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";
        firebaseInit.getStudentOpeningCourseDetails(studentID, 1).then(data => {
            setCourseDetails(data);
            console.log(data);
        });
    }, []);

    return (
        <Container>
            {courseDetails &&
                courseDetails.map(detail => (
                    <Div12 key={detail.courseID}>
                        <DivCourse>{detail.courseID}</DivCourse>
                        <DivCourse>課程作業</DivCourse>
                        {detail.allHomework.length === 0 ? (
                            <div>無資料</div>
                        ) : (
                            detail.allHomework.map(homework => (
                                <Div1 key={homework.title}>
                                    {homework.title}
                                </Div1>
                            ))
                        )}
                        <DivCourse>課程資料</DivCourse>
                        {detail.materials.length === 0 ? (
                            <div>無資料</div>
                        ) : (
                            detail.materials.map(material => (
                                <Div1 key={material.creatDate.seconds}>
                                    <DivContent>{material.title}</DivContent>

                                    <DivContent>
                                        {new Date(
                                            Math.floor(
                                                material.creatDate.seconds *
                                                    1000,
                                            ),
                                        ).toLocaleDateString()}
                                    </DivContent>

                                    <DivContent>
                                        <a href={material.fileURL}>點我下載</a>
                                    </DivContent>
                                </Div1>
                            ))
                        )}
                    </Div12>
                ))}
        </Container>
    );
};
