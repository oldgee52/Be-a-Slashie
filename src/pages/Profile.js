import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { InputForModify } from "../Component/InputForModify";
import { FiUpload } from "react-icons/fi";
import { breakPoint } from "../utils/breakPoint";

const Container = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

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
    useEffect(() => {
        if (userID)
            firebaseInit.getCollectionData("users", userID).then(data => {
                setUserInfo(data);
                SetInputFields({
                    name: data.name,
                    selfIntroduction: data.selfIntroduction,
                });
            });
    }, [userID]);

    const uploadImage = e => {
        if (!e.target.value) return window.alert("請先選擇檔案");
        const mountainImagesRef = ref(
            firebaseInit.storage,
            `photo-${e.target.value}`,
        );
        const uploadTask = uploadBytesResumable(
            mountainImagesRef,
            e.target.files[0],
        );
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        console.log("default");
                }
            },
            error => {
                console.log(error);
                window.alert("上傳失敗");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    async downloadURL => {
                        await updateDoc(doc(firebaseInit.db, "users", userID), {
                            photo: downloadURL,
                        });

                        setUserInfo(prve => ({
                            ...prve,
                            photo: downloadURL,
                        }));

                        e.target.value = "";
                        window.alert("上傳成功");
                    },
                );
            },
        );
    };

    return (
        <Container>
            {userInfo && (
                <>
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
                </>
            )}
        </Container>
    );
};
