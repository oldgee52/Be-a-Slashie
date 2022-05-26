import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiMail } from "react-icons/fi";
import breakPoint from "../../utils/breakPoint";
import HoverInfo from "../common/HoverInfo";

const TeacherInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    margin-top: 20px;
    width: 300px;
    background-color: whitesmoke;
    min-height: 250px;
    color: #505050;
    border: 1px solid #00bea4;
    @media ${breakPoint.desktop} {
        margin: 0;
        width: 100%;
    }
`;

const TeacherImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
`;
const TeacherName = styled.div`
    font-size: 16px;
    font-weight: 600;
    margin-top: 5px;
`;
const TeacherIntroduction = styled.div`
    font-size: 12px;
    line-height: 1.5;

    padding: 20px;
`;
const NewFiMail = styled(FiMail)`
    color: rgba(0, 0, 0, 0.3);
`;

function TeacherInfoArea({
    teacherPhoto,
    teacherEmail,
    teacherName,
    teacherIntroduction,
}) {
    return (
        <TeacherInfo>
            <TeacherImg src={teacherPhoto} />
            <a href={`mailto:${teacherEmail}`}>
                <HoverInfo content="發送E-mail">
                    <NewFiMail />
                </HoverInfo>
            </a>
            <TeacherName>{teacherName}</TeacherName>
            <TeacherIntroduction>{teacherIntroduction}</TeacherIntroduction>
        </TeacherInfo>
    );
}

TeacherInfoArea.propTypes = {
    teacherPhoto: PropTypes.string.isRequired,
    teacherEmail: PropTypes.string.isRequired,
    teacherName: PropTypes.string.isRequired,
    teacherIntroduction: PropTypes.string.isRequired,
};

export default TeacherInfoArea;
