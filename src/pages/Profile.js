import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { InputForModify } from "../Component/InputForModify";
import { FiUpload } from "react-icons/fi";
import { breakPoint } from "../utils/breakPoint";
import { AlertModal } from "../Component/AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";
import { Loading } from "../Component/Loading";
import { useFirebaseUploadFile } from "../customHooks/useFirebaseUploadFile";
import { LoadingForPost } from "../Component/LoadingForPost";

const Container = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;

    @media ${breakPoint.desktop} {
        width: 70%;
        margin-left: 50px;
        margin-top: 0;
        align-items: flex-start;
        justify-content: flex-start;
    }
`;

const UserPhotoLabel = styled.label`
    cursor: pointer;
    @media ${breakPoint.desktop} {
    }
`;

const UserPhoto = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 1px solid #505050;
`;

const FileInput = styled.input`
    display: none;
`;

const UploadIcon = styled(FiUpload)`
    position: absolute;
    right: -7px;
    bottom: 0;
    height: 30px;
    width: 30px;
    background-color: white;
    border: 1px solid white;
    border-radius: 100%;
`;

export const Profile = ({ userID }) => {
    const [userInfo, setUserInfo] = useState();
    const [modifyUserName, setModifyUserName] = useState(true);
    const [modifyUserIntroduction, setModifyUserIntroduction] = useState(true);
    const [inputFields, SetInputFields] = useState();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const [{ fileURL, UploadIsLoading, isError }, setFile, setFileName] =
        useFirebaseUploadFile();
    useEffect(() => {
        let isMounted = true;
        if (userID && isMounted)
            firebaseInit.getCollectionData("users", userID).then(data => {
                if (isMounted) {
                    setUserInfo(data);
                    SetInputFields({
                        name: data.name,
                        selfIntroduction: data.selfIntroduction,
                    });
                }
            });
        return () => {
            isMounted = false;
        };
    }, [userID]);

    useEffect(() => {
        if (!fileURL) return;
        updateDoc(doc(firebaseInit.db, "users", userID), {
            photo: fileURL,
        });

        setUserInfo(prve => ({
            ...prve,
            photo: fileURL,
        }));
        handleAlertModal("上傳成功");
    }, [fileURL]);

    const uploadImage = e => {
        setFile(e.target.files[0]);
        setFileName(e.target.value);
        if (isError) return handleAlertModal("發生錯誤，請再試一次");
    };
    return (
        <>
            {!userInfo ? (
                <Loading />
            ) : (
                <Container>
                    <UserPhotoLabel htmlFor="photo">
                        <UserPhoto src={userInfo.photo} alt={userInfo.name} />
                        <FileInput
                            type="file"
                            accept="image/*"
                            id="photo"
                            onChange={e => {
                                uploadImage(e);
                            }}
                        />
                        <UploadIcon viewBox="-5 -1 30 30" />
                    </UserPhotoLabel>

                    {inputFields && (
                        <>
                            <InputForModify
                                inputFields={inputFields}
                                SetInputFields={SetInputFields}
                                userID={userID}
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                                handleDisable={modifyUserName}
                                setHandleDisable={setModifyUserName}
                                title="姓名"
                                targetName="name"
                                inputText
                            />
                            <InputForModify
                                inputFields={inputFields}
                                SetInputFields={SetInputFields}
                                userID={userID}
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                                handleDisable={modifyUserIntroduction}
                                setHandleDisable={setModifyUserIntroduction}
                                title="自我介紹"
                                targetName="selfIntroduction"
                                inputText={false}
                            />
                        </>
                    )}
                </Container>
            )}
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
            {UploadIsLoading ? <LoadingForPost /> : null}
        </>
    );
};
