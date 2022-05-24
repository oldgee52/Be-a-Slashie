import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsReply } from "react-icons/bs";
import { breakPoint } from "../utils/breakPoint";
import { customDateDisplay } from "../utils/functions";
const MessageInputArea = styled.div`
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

const CurrentMessageArea = styled.div`
    display: flex;
    flex-direction: column;
    color: gray;

    border-bottom: 1px solid gray;
    padding-bottom: 5px;
    @media ${breakPoint.desktop} {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;
const CurrentMessageTitle = styled.div`
    font-size: 14px;
    margin-bottom: 8px;
    @media ${breakPoint.desktop} {
        margin-right: 10px;
        margin-bottom: 10px;
    }
`;
const CurrentMessageContent = styled.div`
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.8);
    word-break: break-all;

    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const ReplyMessageArea = styled.div`
    display: flex;
    flex-direction: column;
    color: gray;

    align-items: flex-end;

    margin-top: 10px;
    margin-left: 30px;

    border-bottom: 1px solid gray;
    padding-bottom: 5px;
    @media ${breakPoint.desktop} {
        justify-content: flex-end;
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const ReplyMessageContent = styled(CurrentMessageContent)`
    align-self: flex-start;
    word-break: break-all;
`;

const ReplyMessageInputArea = styled(MessageInputArea)`
    margin: 0;
    padding-right: 0;
    padding-left: 30px;
    padding-top: 0;
    transition-duration: 1s;
    overflow: hidden;

    height: ${props => (props.show ? "150px" : 0)};
`;

const IsShowReply = styled.div`
    margin-left: 30px;
    margin-top: 10px;

    cursor: pointer;
`;

const ReplyInput = styled(Input)`
    margin-top: 20px;
`;

const MessageReplyArea = ({
    askedQuestions,
    findUserInfo,
    inputFields,
    handleShowReplyInput,
    handleReplyMessage,
    handleSendReplyMessage,
}) => {
    return (
        askedQuestions &&
        askedQuestions
            .map((question, index) => (
                <MessageInputArea key={index}>
                    <CurrentMessageArea>
                        <CurrentMessageTitle>
                            {findUserInfo(question.askedUserID, "name")}
                        </CurrentMessageTitle>
                        <CurrentMessageTitle>
                            {customDateDisplay(
                                question.askedDate.seconds * 1000,
                            )}
                        </CurrentMessageTitle>
                        <CurrentMessageContent>
                            {question.askedContent}
                        </CurrentMessageContent>
                    </CurrentMessageArea>
                    {question.replies &&
                        question.replies.map((reply, index_2) => (
                            <ReplyMessageArea key={index_2}>
                                <CurrentMessageTitle>
                                    {findUserInfo(reply.repliedUserID, "name")}
                                </CurrentMessageTitle>
                                <CurrentMessageTitle>
                                    {customDateDisplay(
                                        reply.repliedDate.seconds * 1000,
                                    )}
                                </CurrentMessageTitle>
                                <ReplyMessageContent>
                                    {reply.repliedContent}
                                </ReplyMessageContent>
                            </ReplyMessageArea>
                        ))}
                    <IsShowReply
                        onClick={() => {
                            handleShowReplyInput(index);
                        }}
                    >
                        {inputFields[index]?.isShowReplyInput ? (
                            <>
                                <RiCloseCircleLine viewBox="0 -2 24 24" />{" "}
                                <span>取消</span>
                            </>
                        ) : (
                            <>
                                <BsReply /> <span>回覆</span>
                            </>
                        )}
                    </IsShowReply>
                    <ReplyMessageInputArea
                        key={index}
                        show={inputFields[index]?.isShowReplyInput}
                    >
                        <ReplyInput
                            value={inputFields[index]?.reply || ""}
                            name="reply"
                            onChange={e => handleReplyMessage(e, index)}
                            show={inputFields[index]?.isShowReplyInput}
                        />
                        <SendButton
                            onClick={() => handleSendReplyMessage(index)}
                        >
                            回覆
                        </SendButton>
                    </ReplyMessageInputArea>
                </MessageInputArea>
            ))
            .reverse()
    );
};

MessageReplyArea.propTypes = {
    askedQuestions: PropTypes.array.isRequired,
    findUserInfo: PropTypes.func.isRequired,
    inputFields: PropTypes.array.isRequired,
    handleShowReplyInput: PropTypes.func.isRequired,
    handleReplyMessage: PropTypes.func.isRequired,
    handleSendReplyMessage: PropTypes.func.isRequired,
};

export default MessageReplyArea;
