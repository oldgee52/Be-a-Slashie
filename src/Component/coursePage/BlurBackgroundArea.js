import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import breakPoint from "../../utils/breakPoint";

const BlurImage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: whitesmoke;

    &::before {
        content: "";
        top: -50px;
        left: -15px;
        width: 100vw;
        height: 98%;
        position: absolute;
        background-image: url(${props => props.img});
        background-size: cover;
        background-repeat: no-repeat;
        filter: blur(5px) brightness(60%);
    }
    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const BlurImageWeb = styled(BlurImage)`
    display: none;
    @media ${breakPoint.desktop} {
        display: block;
        width: 100%;
        height: 150px;
        &::before {
            width: 100%;
            height: 120%;
            left: 0;
            background-image: url(${props => props.img});
        }
    }
`;

function BlurBackgroundArea({ img, isWeb, children }) {
    return isWeb ? (
        <BlurImageWeb img={img}>{children}</BlurImageWeb>
    ) : (
        <BlurImage img={img} Web={isWeb}>
            {children}
        </BlurImage>
    );
}

BlurBackgroundArea.propTypes = {
    img: PropTypes.string.isRequired,
    isWeb: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};
export default BlurBackgroundArea;
