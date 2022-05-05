import React, { useState } from "react";
import Modal from "styled-react-modal";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";

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
    border-radius: 5px;
    background: #00e0b6;
    color: #fff;
    letter-spacing: 2px;
    cursor: pointer;
    align-self: flex-end;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #00e0b6;
`;
const TextArea = styled.div`
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    padding: 0 20px;
    /* padding-left: 50px;
    padding-top: 50px; */
`;

export const AlertModal = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);

    function toggleModal(e) {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <button onClick={toggleModal}>Click me</button>
            <StyledModal
                isOpen={isOpen}
                onBackgroundClick={toggleModal}
                onEscapeKeydown={toggleModal}
            >
                <TextArea>註冊成功，可以去個人修改大頭照跟自我介紹喔</TextArea>
                <ModalButton onClick={toggleModal}>確定</ModalButton>
            </StyledModal>
        </div>
    );
};
