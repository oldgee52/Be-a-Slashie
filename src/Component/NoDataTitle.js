import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { breakPoint } from "../utils/breakPoint";

const NoShow = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    @media ${breakPoint.desktop} {
        align-self: flex-start;
    }
`;

const NoDataTitle = ({ title }) => {
    return <NoShow>{title}</NoShow>;
};

NoDataTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export default NoDataTitle;
