import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import firebaseInit from "../../utils/firebase";

const MessageInputBox = styled.div`
    display: flex;
    flex-direction: column;
    background-color: whitesmoke;
    border: 1px solid whitesmoke;
    border-radius: 5px;
    width: 100%;
    padding: 20px;
    padding-bottom: 10px;
    margin-top: 20px;
`;
const Input = styled.textarea`
    width: 100%;
    height: 80px;

    padding: 5px;

    font-size: 16px;
`;

const SendButton = styled.button`
    width: 50px;
    height: 30px;
    line-height: 30px;
    background-color: #00bea4;
    color: white;
    margin-left: auto;
    margin-top: 10px;
    border-radius: 5px;
    cursor: pointer;
`;

function MessageInputArea({ courseID, userID, handleAlertModal }) {
    const [message, setMessage] = useState("");

    async function handSendMessage() {
        if (!message.trim()) return handleAlertModal("請輸入訊息");

        await firebaseInit.updateDocForSendMessage(courseID, message, userID);
        setMessage("");
        handleAlertModal("留言已送出");
        return null;
    }

    return (
        <MessageInputBox>
            <Input value={message} onChange={e => setMessage(e.target.value)} />
            <SendButton onClick={() => handSendMessage()}>送出</SendButton>
        </MessageInputBox>
    );
}

MessageInputArea.propTypes = {
    userID: PropTypes.string.isRequired,
    courseID: PropTypes.string.isRequired,
    handleAlertModal: PropTypes.func.isRequired,
};

export default MessageInputArea;
