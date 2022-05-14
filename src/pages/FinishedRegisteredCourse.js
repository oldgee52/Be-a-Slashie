import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import check from "../images/check.png";
import { MyButton } from "../Component/MyButton";
import { useParams, useNavigate } from "react-router-dom";
import firebaseInit from "../utils/firebase";
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    padding: 80px 10px 80px 10px;

    @media ${breakPoint.desktop} {
        margin: auto;
        max-width: 1200px;
    }
`;
const CheckedImg = styled.div`
    margin-top: 50px;
    background-image: url(${check});
    background-size: contain;
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
`;

const Text = styled.div`
    width: 100%;
    text-align: center;
    font-size: 16px;
    margin-top: 12px;
    line-height: 1.2;
`;

const ButtonBox = styled.div`
    display: flex;
    width: 100%;
    margin-top: 20px;
    @media ${breakPoint.desktop} {
        width: 200px;
    }
`;

export const FinishedRegisteredCourse = () => {
    const { courseID } = useParams();
    const [course, setCourse] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        firebaseInit.getCourseDetail(courseID).then(data => {
            console.log(data);
            setCourse(data);
        });
    }, [courseID]);

    return (
        <Container>
            {course && (
                <>
                    <CheckedImg />
                    <Text>恭喜您已完成 課程-{course.title} 報名</Text>
                    <Text>若有任何問題，可與老師直接聯繫</Text>
                    <Text>課程資訊將已透過E-mail發送至您的信箱</Text>
                    <ButtonBox>
                        <MyButton
                            buttonWord="查看報名狀況"
                            clickFunction={() =>
                                navigate("/personal/student-registered-course")
                            }
                        />
                    </ButtonBox>
                </>
            )}
        </Container>
    );
};
