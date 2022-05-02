import React from "react";
import styled from "styled-components";

const NoShow = styled.div`
    margin-top: 10px;
    font-size: 16px;
    font-weight: 700;
`;

export const NoDataTitle = ({ title }) => {
    return <NoShow>{title}</NoShow>;
};
