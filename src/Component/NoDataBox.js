import React from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Component/MyButton";
import NoDataTitle from "../Component/NoDataTitle";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import PropTypes from "prop-types";

const Box = styled.div`
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media ${breakPoint.desktop} {
        margin-top: ${props => props.marginTop};
        margin-left: ${props => props.marginLeft};
    }
`;

const NoDataBox = ({ title, buttonWord, marginTop, marginLeft, path }) => {
    const navigate = useNavigate();
    return (
        <Box marginTop={marginTop} marginLeft={marginLeft}>
            <NoDataTitle title={title} />
            <MyButton
                buttonWord={buttonWord}
                clickFunction={() => navigate(path)}
            />
        </Box>
    );
};
NoDataBox.propTypes = {
    title: PropTypes.string.isRequired,
    buttonWord: PropTypes.string.isRequired,
    marginTop: PropTypes.string.isRequired,
    marginLeft: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
};

export default NoDataBox;
