import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { InputForModify } from "../Component/InputForModify";

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
            setUserInfo(data);
            SetInputFields({
                name: data.name,
                selfIntroduction: data.selfIntroduction,
            });
        });
    }, []);
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
                    {inputFields && (
                        <>
                            <InputForModify
                                inputFields={inputFields}
                                SetInputFields={SetInputFields}
                                studentID={studentID}
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                                handleDisable={modifyUserName}
                                setHandleDisable={setModifyUserName}
                                title="姓名"
                                targetName="name"
                            />
                            <InputForModify
                                inputFields={inputFields}
                                SetInputFields={SetInputFields}
                                studentID={studentID}
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                                handleDisable={modifyUserIntroduction}
                                setHandleDisable={setModifyUserIntroduction}
                                title="自我介紹"
                                targetName="selfIntroduction"
                            />
                        </>
                    )}
                </>
            )}
        </Container>
    );
};
