import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
    BsPersonCheck,
    BsCalendarPlus,
    BsCalendarCheck,
    BsPatchCheck,
    BsCardText,
} from "react-icons/bs";
import breakPoint from "../../utils/breakPoint";
import Skills from "../skills/Skills";
import { customDateDisplay } from "../../utils/functions";

const AboutCourse = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding-left: 5px;

    @media ${breakPoint.desktop} {
        align-self: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
        width: calc(75% - 20px);
        padding-left: 20px;
        order: 2;
    }
`;

const AboutTitle = styled.div`
    font-size: 20px;

    margin-top: 10px;
    margin-bottom: 10px;
    color: #ff6700;

    @media ${breakPoint.desktop} {
        font-size: 24px;
        width: 100%;
    }
`;

const AboutContent = styled.div`
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 5px;

    @media ${breakPoint.desktop} {
        padding-right: 50px;
    }
`;

const AboutContentsSkill = styled(AboutContent)`
    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const SkillsBox = styled.div`
    display: flex;
    margin-top: 20px;
    justify-content: center;
    width: 100%;
    margin-left: 10px;
    font-weight: 500;
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;

const CourseIntroduction = styled.p`
    margin-top: 15px;
    font-size: 12px;
    line-height: 1.5;
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        font-size: 16px;
    }
`;

const NewBsPersonCheck = styled(BsPersonCheck)`
    width: 20px;
`;
const NewBsCalendarPlus = styled(BsCalendarPlus)`
    width: 20px;
`;

const NewBsCalendarCheck = styled(BsCalendarCheck)`
    width: 20px;
    margin-right: 5px;
`;
const NewBsPatchCheck = styled(BsPatchCheck)`
    width: 20px;
    margin-right: 5px;
`;
const NewBsCardText = styled(BsCardText)`
    width: 20px;
    margin-right: 5px;
`;

function CourseDetailInfo({
    minOpeningNumber,
    registrationDeadline,
    openingDate,
    skillsInfo,
    courseIntroduction,
}) {
    return (
        <AboutCourse>
            <AboutTitle>關於課程</AboutTitle>
            <AboutContent>
                <NewBsPersonCheck viewBox="0 0 16 16" />{" "}
                <span>開班人數 {minOpeningNumber}</span>
            </AboutContent>
            <AboutContent>
                <NewBsCalendarPlus viewBox="2 0 16 16" />{" "}
                <span>報名截止 {customDateDisplay(registrationDeadline)}</span>
            </AboutContent>
            <AboutContent>
                <NewBsCalendarCheck viewBox="2 0 16 16" />
                <span>開課時間 {customDateDisplay(openingDate)}</span>
            </AboutContent>
            <AboutContentsSkill>
                <NewBsPatchCheck viewBox="2 0 16 16" />
                <span>
                    可獲技能{" "}
                    <SkillsBox>
                        <Skills skills={skillsInfo} />
                    </SkillsBox>
                </span>
            </AboutContentsSkill>
            <AboutContent>
                <NewBsCardText viewBox="2 0 16 16" />
                <span>課程詳情</span>
                <CourseIntroduction>{courseIntroduction}</CourseIntroduction>
            </AboutContent>
        </AboutCourse>
    );
}

CourseDetailInfo.propTypes = {
    minOpeningNumber: PropTypes.number.isRequired,
    registrationDeadline: PropTypes.number.isRequired,
    openingDate: PropTypes.number.isRequired,
    skillsInfo: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string.isRequired,
            skillID: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }),
    ).isRequired,
    courseIntroduction: PropTypes.string.isRequired,
};

export default CourseDetailInfo;
