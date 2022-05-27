import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BsBookmark } from "react-icons/bs";
import breakPoint from "../../utils/breakPoint";

const Collection = styled.button`
    margin-top: 20px;
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 50px;
    border-radius: 5px;
    font-size: 14px;
    border: ${props => (props.collected ? "none" : "1px solid #505050")};
    color: ${props => (props.collected ? "whitesmoke" : " #505050")};
    background: ${props => (props.collected ? "#00bea4" : "whitesmoke")};
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    @media ${breakPoint.desktop} {
        width: 100%;
        z-index: 2;
    }
`;

const NewBsBookmark = styled(BsBookmark)`
    width: 20px;
    margin-right: 5px;
`;

function CollectionButton({ handleCollection, userCollection }) {
    return (
        <Collection onClick={handleCollection} collected={userCollection}>
            <NewBsBookmark />
            <span>{userCollection ? "已收藏" : "加入收藏"}</span>
        </Collection>
    );
}

CollectionButton.propTypes = {
    handleCollection: PropTypes.func.isRequired,
    userCollection: PropTypes.bool.isRequired,
};

export default CollectionButton;
