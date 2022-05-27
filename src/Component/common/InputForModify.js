import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { BsPencil } from "react-icons/bs";
import firebaseInit from "../../utils/firebase";
import breakPoint from "../../utils/breakPoint";
import { handleChangeForObject } from "../../utils/functions";

const Container = styled.div`
    width: 80%;
    display: flex;
    justify-content: center;
    padding: 20px;

    flex-wrap: wrap;
    border-bottom: 1px solid black;

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;

const Title = styled.div`
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    @media ${breakPoint.desktop} {
        display: flex;
        align-items: center;
        width: 80px;
        margin-bottom: 0;
    }
`;

const Input = styled.input`
    width: 50%;
    padding: 5px;
    font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
    font-size: 16px;
    word-break: break-word;
    text-align: center;
    border: none;
    border-radius: 5px;

    background-color: rgba(0, 0, 0, 0.1);
    &:focus {
        outline: none;
    }

    &:disabled {
        background-color: rgba(0, 0, 0, 0.001);
    }

    @media ${breakPoint.desktop} {
        text-align: left;
        width: 60%;
        height: 40px;
    }
`;

const InputText = styled.textarea`
    width: 50%;
    height: 70px;
    padding: 5px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.1);

    border: none;
    border-radius: 5px;
    font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
    font-size: 16px;
    &:focus {
        outline: none;
        overflow: inherit;
    }

    &:disabled {
        background-color: rgba(0, 0, 0, 0.001);
    }

    @media ${breakPoint.desktop} {
        width: 60%;
    }
`;

const PencilBox = styled.button`
    cursor: pointer;
    @media ${breakPoint.desktop} {
        align-self: flex-end;
        margin-left: auto;
    }
`;

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    width: 100%;
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        width: 20%;
        margin-left: auto;
    }
`;

const ButtonConfirm = styled.button`
    width: 80px;
    height: 40px;
    color: white;
    cursor: pointer;
    background: ${props =>
        props.confirm
            ? "linear-gradient(to left,#ff8f08 -10.47%,#ff6700 65.84%)"
            : "#7f7f7f"};

    border-radius: 5px;
    margin-right: 10px;
    @media ${breakPoint.desktop} {
        width: 50px;
        height: 30px;
    }
`;

function InputForModify({
    inputFields,
    SetInputFields,
    userID,
    userInfo,
    setUserInfo,
    handleDisable,
    setHandleDisable,
    title,
    targetName,
    inputText,
    handleAlertModal,
}) {
    const inputElement = useRef(null);

    useEffect(() => {
        if (!handleDisable) inputElement.current.focus();
    }, [inputElement, handleDisable]);

    const handleInputChange = e =>
        handleChangeForObject(
            inputFields,
            e.target.name,
            e.target.value,
            SetInputFields,
        );

    async function handleModifyClick(state, modifyCallback, modifyContent) {
        if (state) {
            modifyCallback(false);
        }
        if (!state) {
            firebaseInit
                .handleProfileInfoChange(modifyContent, inputFields, userID)
                .then(() => {
                    setUserInfo(prve => ({
                        ...prve,
                        [`${modifyContent}`]: inputFields[modifyContent],
                    }));
                    modifyCallback(true);
                })
                .catch(error =>
                    handleAlertModal(`發生錯誤，錯誤內容：${error}`),
                );
        }
    }

    function handleCancelModify(modifyCallback, modifyContent) {
        modifyCallback(true);
        SetInputFields(prve => ({
            ...prve,
            [`${modifyContent}`]: userInfo[modifyContent],
        }));
    }

    return (
        <Container>
            <Title>{title}</Title>
            {inputText ? (
                <Input
                    value={inputFields[targetName]}
                    name={targetName}
                    onChange={handleInputChange}
                    disabled={handleDisable}
                    ref={inputElement}
                />
            ) : (
                <InputText
                    value={inputFields[targetName]}
                    name={targetName}
                    onChange={handleInputChange}
                    disabled={handleDisable}
                    onFocus={e => {
                        const { value } = e.target;
                        e.target.value = "";
                        e.target.value = value;
                    }}
                    ref={inputElement}
                />
            )}

            {handleDisable && (
                <PencilBox
                    onClick={() => {
                        handleModifyClick(
                            handleDisable,
                            setHandleDisable,
                            targetName,
                        );
                    }}
                >
                    <BsPencil />
                </PencilBox>
            )}
            {handleDisable || (
                <ButtonBox>
                    <ButtonConfirm
                        confirm
                        onClick={() =>
                            handleModifyClick(
                                handleDisable,
                                setHandleDisable,
                                targetName,
                            )
                        }
                    >
                        確定
                    </ButtonConfirm>
                    <ButtonConfirm
                        confirm={false}
                        onClick={() => {
                            handleCancelModify(setHandleDisable, targetName);
                        }}
                    >
                        取消
                    </ButtonConfirm>
                </ButtonBox>
            )}
        </Container>
    );
}

InputForModify.propTypes = {
    inputFields: PropTypes.objectOf(PropTypes.string).isRequired,
    SetInputFields: PropTypes.func.isRequired,
    userID: PropTypes.string.isRequired,
    userInfo: PropTypes.shape({
        name: PropTypes.string,
        photo: PropTypes.string,
        selfIntroduction: PropTypes.string,
    }).isRequired,
    setUserInfo: PropTypes.func.isRequired,
    handleDisable: PropTypes.bool.isRequired,
    setHandleDisable: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    targetName: PropTypes.string.isRequired,
    inputText: PropTypes.bool.isRequired,
    handleAlertModal: PropTypes.func.isRequired,
};

export default InputForModify;
