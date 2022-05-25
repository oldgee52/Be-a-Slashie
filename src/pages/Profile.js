import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiUpload } from "react-icons/fi";
import { breakPoint } from "../utils/breakPoint";
import AlertModal from "../Component/common/AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";
import InputForModify from "../Component/common/InputForModify";
import { Loading } from "../Component/loading/Loading";
import { LoadingForPost } from "../Component/loading/LoadingForPost";
import { useFirebaseUploadFile } from "../customHooks/useFirebaseUploadFile";

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

const Profile = ({ userID }) => {
    const [userInfo, setUserInfo] = useState();
    const [modifyUserName, setModifyUserName] = useState(true);
    const [modifyUserIntroduction, setModifyUserIntroduction] = useState(true);
    const [inputFields, SetInputFields] = useState();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const [uploadIsLoading, uploadFile] = useFirebaseUploadFile();
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

    const handleUploadImage = async (fileName, file) => {
        if (!fileName || !file) return;

        const fileURL = await uploadFile(fileName, file);
        await firebaseInit.updateDocForProfilePhoto(userID, fileURL);
        setUserInfo(prve => ({
            ...prve,
            photo: fileURL,
        }));
        handleAlertModal("上傳成功");
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
                                handleUploadImage(
                                    e.target.value,
                                    e.target.files[0],
                                );
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
            {uploadIsLoading ? <LoadingForPost /> : null}
        </>
    );
};

Profile.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default Profile;
