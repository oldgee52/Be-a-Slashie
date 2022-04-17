import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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

export const Profile = () => {
    const [userInfo, setUserInfo] = useState();
    const [modifyUserName, setModifyUserName] = useState(true);
    const [modifyUserIntroduction, setModifyUserIntroduction] = useState(true);
    const [inputFields, SetInputFields] = useState();
    const [image, setImage] = useState();
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

    const uploadImage = () => {
        if (!image?.value) return window.alert("請先選擇檔案");
        const mountainImagesRef = ref(
            firebaseInit.storage,
            `photo-${image.value}`,
        );
        const uploadTask = uploadBytesResumable(
            mountainImagesRef,
            image.files[0],
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

                        image.value = "";
                        window.alert("上傳成功");
                    },
                );
            },
        );
    };

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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImage(e.target)}
                        />
                        <button onClick={uploadImage}>上傳</button>
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
