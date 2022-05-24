import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { breakPoint } from "../utils/breakPoint";

const CourseTitle = styled.div`
    font-size: 20px;
    font-weight: 700;
    width: 100%;

    text-align: center;

    line-height: 1.5;

    @media ${breakPoint.desktop} {
        text-align: left;
        font-size: 24px;
        padding-left: 20px;
    }
`;

const CourseInfo = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        margin-bottom: 20px;
        justify-content: flex-start;
        order: 1;
        padding-left: 20px;
    }
`;
const InfoTitle = styled.div`
    margin-left: 5px;
    margin-right: 5px;
    @media ${breakPoint.desktop} {
        margin-left: 0px;
        margin-right: 10px;
    }
`;

const CourseHeadersInfo = ({ title, registrationNumber, view }) => {
    return (
        <>
            <CourseTitle>{title}</CourseTitle>
            <CourseInfo>
                <InfoTitle>報名人數 {registrationNumber}</InfoTitle>

                <InfoTitle>瀏覽人數 {view}</InfoTitle>
            </CourseInfo>
        </>
    );
};

CourseHeadersInfo.propTypes = {
    title: PropTypes.string.isRequired,
    registrationNumber: PropTypes.number.isRequired,
    view: PropTypes.number.isRequired,
};

export default CourseHeadersInfo;
