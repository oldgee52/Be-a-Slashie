import React from "react";
import Modal from "styled-react-modal";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const StyledModal = Modal.styled`
  width: 80%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: whitesmoke;
  flex-direction: column;
  border-radius: 5px;
  line-height: 1.5;

  box-shadow: 2px 2px 2px 1px rgba(255, 103, 0, 0.5);
  @media ${breakPoint.desktop} {
    width: 35%;
}
`;

const ModalButton = styled.button`
    width: 50px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: #00bea4;
    color: #fff;
    cursor: pointer;
    align-self: flex-end;
    margin-right: 10px;
    margin-bottom: 10px;
`;
const TextArea = styled.div`
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    padding: 0 20px;
    white-space: pre-line;
    line-height: 1;
`;

const AlertModal = ({
    content,
    alertIsOpen,
    setAlertIsOpen,
    courseID,
    isNavigateToOtherRouter,
    pathname,
}) => {
    const navigate = useNavigate();
    function toggleModal() {
        setAlertIsOpen(false);
        if (courseID) {
            navigate(`/course?courseID=${courseID}`);
        }
        if (isNavigateToOtherRouter) {
            navigate(pathname, { replace: true });
        }
    }

    return (
        <>
            <StyledModal
                isOpen={alertIsOpen}
                onBackgroundClick={toggleModal}
                onEscapeKeydown={toggleModal}
            >
                <TextArea>{content}</TextArea>
                <ModalButton onClick={toggleModal}>確定</ModalButton>
            </StyledModal>
        </>
    );
};

AlertModal.propTypes = {
    content: PropTypes.string.isRequired,
    alertIsOpen: PropTypes.bool.isRequired,
    setAlertIsOpen: PropTypes.func.isRequired,
    courseID: PropTypes.string,
    pathname: PropTypes.string,
    isNavigateToOtherRouter: PropTypes.bool,
};

export default AlertModal;
