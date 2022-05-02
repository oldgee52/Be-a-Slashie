import React from "react";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";

const NoShow = styled.div`
    margin-top: 10px;
    font-size: 16px;
    font-weight: 700;
    @media ${breakPoint.desktop} {
        align-self: flex-start;
    }
`;

export const NoDataTitle = ({ title }) => {
    return <NoShow>{title}</NoShow>;
};
