import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { InputForModify } from "../Component/InputForModify";
import { FiUpload } from "react-icons/fi";

const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
`;

const UserPhoto = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 1px solid black;
    cursor: pointer;
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
    cursor: pointer;
`;
const Div1 = styled.div`
    width: 100%;
    display: flex;
    margin-top: 20px;
`;

const DivTitle = styled.div`
    width: 20%;
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
                        await updateDoc(
                            doc(firebaseInit.db, "users", studentID),
                            {
                                photo: downloadURL,
                            },
                        );

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
                    <label htmlFor="photo">
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
                    </label>

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
                                inputText
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
                                inputText={false}
                            />
                        </>
                    )}
                </>
            )}
        </Container>
    );
};
