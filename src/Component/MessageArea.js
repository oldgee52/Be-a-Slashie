import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { breakPoint } from "../utils/breakPoint";
import { MessageInputArea } from "./MessageInputArea";
import { MessageReplyArea } from "./MessageReplyArea";
import firebaseInit from "../utils/firebase";

const MessageBox = styled.div`
    width: 100%;
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        order: 4;
    }
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0 30px 0;
    width: 90%;
    margin: auto;
    border-top: 1px solid #7f7f7f;
    @media ${breakPoint.desktop} {
        width: calc(75% - 20px);
        margin: 0;
    }
`;

const MessageHeader = styled.div`
    font-size: 20px;
    @media ${breakPoint.desktop} {
        font-size: 24px;
    }
`;

const MessageArea = ({
    courseData,
    setInputFields,
    inputFields,
    handleAlertModal,
    userID,
    findUserInfo,
}) => {
    const handleReplyMessage = (e, index) => {
        let data = [...inputFields];
        data[index][e.target.name] = e.target.value;
        setInputFields(data);
    };

    const handleShowReplyInput = index => {
        let data = [...inputFields];
        data[index]["isShowReplyInput"] = !data[index]["isShowReplyInput"];
        setInputFields(data);
    };

    const handleSendReplyMessage = async index => {
        if (!inputFields[index].reply.trim())
            return handleAlertModal("請輸入訊息");
        await firebaseInit.updateDocForReplyMessage(
            courseData,
            index,
            inputFields,
            userID,
        );

        return handleAlertModal("回覆已送出");
    };
    return (
        <MessageBox>
            <MessageContainer>
                <MessageHeader>上課前問問</MessageHeader>
                <MessageInputArea
                    courseID={courseData.courseID}
                    userID={userID}
                    handleAlertModal={handleAlertModal}
                />
                <MessageReplyArea
                    askedQuestions={courseData.askedQuestions}
                    findUserInfo={findUserInfo}
                    inputFields={inputFields}
                    handleShowReplyInput={handleShowReplyInput}
                    handleReplyMessage={handleReplyMessage}
                    handleSendReplyMessage={handleSendReplyMessage}
                />
            </MessageContainer>
        </MessageBox>
    );
};

MessageArea.propTypes = {
    courseData: PropTypes.object.isRequired,
    setInputFields: PropTypes.func.isRequired,
    inputFields: PropTypes.array.isRequired,
    handleAlertModal: PropTypes.func.isRequired,
    userID: PropTypes.string.isRequired,
    findUserInfo: PropTypes.func.isRequired,
};

export { MessageArea };
