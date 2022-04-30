import React from "react";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import firebaseInit from "../utils/firebase";
import { BsPencil } from "react-icons/bs";

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px;

    flex-wrap: wrap;
`;

const Title = styled.div`
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 70%;
    /* height: 50px; */
    font-size: 20px;
    padding: 5px;

    word-break: break-word;
    text-align: center;
    border: none;
    &:focus {
        outline: none;
    }

    &:disabled {
        background-color: white;
    }
`;

const InputText = styled.textarea`
    width: 70%;
    height: 70px;
    font-size: 14px;
    padding: 5px;
    overflow: hidden;

    border: none;
    &:focus {
        outline: none;
        overflow: inherit;
    }

    &:disabled {
        background-color: white;
    }
`;

const PencilBox = styled.button``;

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const ButtonConfirm = styled.button`
    width: 80px;
    height: 40px;
    color: white;
    background-color: ${props => (props.confirm ? "#ff6100" : "#7f7f7f")};

    border-radius: 5px;
    margin-right: 10px;
`;

export const InputForModify = ({
    inputFields,
    SetInputFields,
    studentID,
    userInfo,
    setUserInfo,
    handleDisable,
    setHandleDisable,
    title,
    targetName,
    inputText,
}) => {
    function handleInputChange(e) {
        let data = { ...inputFields };
        data[e.target.name] = e.target.value;
        SetInputFields(data);
    }

    async function handleModifyClick(state, modifyCallback, modifyContent) {
        if (state) {
            modifyCallback(false);
        }
        if (!state) {
            const modifyData = {
                [`${modifyContent}`]: inputFields[modifyContent],
            };
            console.log(modifyData);
            await updateDoc(
                doc(firebaseInit.db, "users", studentID),
                modifyData,
            );
            setUserInfo(prve => ({
                ...prve,
                [`${modifyContent}`]: inputFields[modifyContent],
            }));
            modifyCallback(true);
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
                    onChange={e => handleInputChange(e)}
                    disabled={handleDisable}
                />
            ) : (
                <InputText
                    value={inputFields[targetName]}
                    name={targetName}
                    onChange={e => handleInputChange(e)}
                    disabled={handleDisable}
                />
            )}

            {handleDisable && (
                <PencilBox
                    onClick={() =>
                        handleModifyClick(
                            handleDisable,
                            setHandleDisable,
                            targetName,
                        )
                    }
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
};
