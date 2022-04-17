import React, { useState } from "react";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import firebaseInit from "../utils/firebase";

const Div1 = styled.div`
    width: 100%;
    display: flex;
    margin-top: 20px;
`;

const DivTitle = styled.div`
    width: 20%;
`;

const Input = styled.input`
    width: 50%;
    height: 20px;
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
        <Div1>
            <DivTitle>{title}</DivTitle>
            <Input
                value={inputFields[targetName]}
                name={targetName}
                onChange={e => handleInputChange(e)}
                disabled={handleDisable}
            ></Input>
            <button
                onClick={() =>
                    handleModifyClick(
                        handleDisable,
                        setHandleDisable,
                        targetName,
                    )
                }
            >
                {handleDisable ? "修改" : "確定"}
            </button>
            {handleDisable || (
                <button
                    onClick={() => {
                        handleCancelModify(setHandleDisable, targetName);
                    }}
                >
                    取消
                </button>
            )}
        </Div1>
    );
};
