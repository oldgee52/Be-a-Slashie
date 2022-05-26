import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const IconBox = styled.span`
    cursor: pointer;
    margin-right: 5px;
    margin-left: 5px;

    &::before {
        content: "${props => props.content}";
        position: absolute;
        transform: translateY(0) translateX(-40%);
        background-color: #e9e9e9;
        color: #7f7f7f;
        font-size: 12px;
        width: max-content;
        overflow: hidden;
        padding: 5px;
        border-radius: 5px;
        z-index: -1;
        opacity: 0;
        transition-duration: 0.2s;
    }
    &:hover::before {
        opacity: 1;
        z-index: 10;
        transform: translateY(20px) translateX(-40%);
    }
`;

function HoverInfo({ content, children }) {
    return <IconBox content={content}>{children}</IconBox>;
}

HoverInfo.propTypes = {
    content: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default HoverInfo;
