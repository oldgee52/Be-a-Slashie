import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;
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

export const Profile = () => {
    const [userInfo, setUserInfo] = useState();
    const [modifyUserName, setModifyUserName] = useState(true);
    const [modifyUserIntroduction, setModifyUserIntroduction] = useState(true);
    const [inputFields, SetInputFields] = useState();
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";
    useEffect(() => {
        firebaseInit.getCollectionData("users", studentID).then(data => {
            console.log(data);
            setUserInfo(data);
            SetInputFields({
                name: data.name,
                selfIntroduction: data.selfIntroduction,
            });
        });
    }, []);

    function handleInputChange(e) {
        let data = { ...inputFields };
        data[e.target.name] = e.target.value;
        SetInputFields(data);
    }

    // async function handleModifyClick() {
    //     if (modifyUserName) {
    //         setModifyUserName(false);
    //     }
    //     if (!modifyUserName) {
    //         await updateDoc(doc(firebaseInit.db, "users", studentID), {
    //             name: inputFields.name,
    //         });
    //         setUserInfo(prve => ({
    //             ...prve,
    //             name: inputFields.name,
    //         }));
    //         setModifyUserName(true);
    //     }
    // }

    // function handleCancelModify() {
    //     setModifyUserName(true);
    //     SetInputFields(prve => ({
    //         ...prve,
    //         name: userInfo.name,
    //     }));
    // }

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
            <div>Profile</div>
            {userInfo && (
                <>
                    <Div1>
                        <DivTitle>照片</DivTitle>
                        <img
                            src={userInfo.photo}
                            alt={userInfo.name}
                            width="50"
                            height="50"
                        ></img>
                    </Div1>
                    <Div1>
                        <DivTitle>姓名</DivTitle>
                        <Input
                            value={inputFields?.name || ""}
                            disabled={modifyUserName}
                            name="name"
                            onChange={e => handleInputChange(e)}
                        ></Input>
                        <button
                            onClick={() =>
                                handleModifyClick(
                                    modifyUserName,
                                    setModifyUserName,
                                    "name",
                                )
                            }
                        >
                            {modifyUserName ? "修改" : "確定"}
                        </button>
                        {modifyUserName || (
                            <button
                                onClick={() => {
                                    handleCancelModify(
                                        setModifyUserName,
                                        "name",
                                    );
                                }}
                            >
                                取消
                            </button>
                        )}
                    </Div1>
                    <Div1>
                        <DivTitle>自我介紹</DivTitle>
                        <Input
                            value={inputFields?.selfIntroduction || ""}
                            name="selfIntroduction"
                            onChange={e => handleInputChange(e)}
                            disabled={modifyUserIntroduction}
                        ></Input>
                        <button
                            onClick={() =>
                                handleModifyClick(
                                    modifyUserIntroduction,
                                    setModifyUserIntroduction,
                                    "selfIntroduction",
                                )
                            }
                        >
                            {modifyUserIntroduction ? "修改" : "確定"}
                        </button>
                        {modifyUserIntroduction || (
                            <button
                                onClick={() => {
                                    handleCancelModify(
                                        setModifyUserIntroduction,
                                        "selfIntroduction",
                                    );
                                }}
                            >
                                取消
                            </button>
                        )}
                    </Div1>
                </>
            )}
        </Container>
    );
};
