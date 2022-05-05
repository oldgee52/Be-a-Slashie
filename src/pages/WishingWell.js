import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "../Component/TextInput";
import styled from "styled-components";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import firebaseInit from "../utils/firebase";
import { Waypoint } from "react-waypoint";
import { breakPoint } from "../utils/breakPoint";
import { useAlertModal } from "../customHooks/useAlertModal";
import { AlertModal } from "../Component/AlertModal";
import { Loading } from "../Component/Loading";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    padding: 80px 10px 0px 10px;

    @media ${breakPoint.desktop} {
        margin: auto;
        max-width: 1200px;
    }
`;

const Button = styled.button`
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    letter-spacing: 1px;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background: linear-gradient(
        to left,
        rgb(2, 170, 176) -10.47%,
        rgb(0, 224, 182) 65.84%
    );

    cursor: pointer;

    margin-top: 20px;
    margin-bottom: 20px;

    @media ${breakPoint.desktop} {
        width: 100px;
        margin: 0;
        margin-left: 10px;
    }
`;

const InputArea = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        display: flex;
        width: 500px;

        align-self: start;
        margin-bottom: 20px;
    }
`;

const Title = styled.div`
    font-size: 24px;
    letter-spacing: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 100%;

    text-align: center;
`;

const CourseCard = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    background-color: whitesmoke;
    border-radius: 5px;

    padding-bottom: 20px;
    border-bottom: 3px solid rgb(0 190 164);

    @media ${breakPoint.desktop} {
        break-inside: avoid-column;
        &:first-child {
            margin-top: 0;
        }
    }
`;
const UserPhoto = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    object-fit: cover;
    margin: 5px 10px 0 10px;

    @media ${breakPoint.desktop} {
    }
`;
const ContentArea = styled.div`
    width: 100%;
    padding: 0 25px;
    @media ${breakPoint.desktop} {
        width: 85%;

        padding: 0;
    }
`;

const InfoArea = styled.div`
    width: calc(100% - 80px);
    @media ${breakPoint.desktop} {
    }
`;

const Info = styled.p`
    font-size: 14px;
    margin-top: 22px;
    @media ${breakPoint.desktop} {
        font-size: 18px;
        margin-top: 20px;
    }
`;

const TeacherName = styled.p`
    color: #7f7f7f;
    font-size: 14px;
    line-height: 20px;
    margin-top: 5px;
    @media ${breakPoint.desktop} {
        font-size: 18px;
        margin-top: 10px;
    }
`;

const WishContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    @media ${breakPoint.desktop} {
        display: block;
        column-count: 3;
        column-gap: 20px;
    }
`;

export const WishingWell = ({ userID }) => {
    const [wishingContent, setWishingContent] = useState("");
    const [wishes, setWishes] = useState([]);
    const [usersInfo, setUsersInfo] = useState();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const lasWishSnapshotRef = useRef();

    useEffect(() => {
        firebaseInit.getFirstBatchWishes().then(data => {
            lasWishSnapshotRef.current = data.lastKey;
            console.log(data);
            setWishes(data.wishes);
        });
    }, []);

    useEffect(() => {
        firebaseInit
            .getCollection(collection(firebaseInit.db, "users"))
            .then(data => {
                setUsersInfo(data);
            });
    }, []);

    async function loadingNextWishes(key) {
        if (key) {
            firebaseInit.getNextBatchWishes(key).then(data => {
                lasWishSnapshotRef.current = data.lastKey;
                setWishes([...wishes, ...data.wishes]);
                console.log(data);
            });
        }
    }

    function findUserInfo(userID, info) {
        const result = usersInfo.filter(array => array.uid === userID);

        return result[0][info];
    }

    function handleChange(e) {
        setWishingContent(e.target.value);
    }

    async function makeWish() {
        if (!wishingContent.trim()) return handleAlertModal("請輸入內容");
        try {
            const coursesRef = collection(firebaseInit.db, "wishingWells");
            const docRef = doc(coursesRef);

            const data = {
                content: wishingContent,
                creatDate: Timestamp.now(),
                userID: userID,
                id: docRef.id,
            };
            await setDoc(docRef, data);

            setWishingContent("");
            setWishes([data, ...wishes]);
            handleAlertModal("許願成功");
        } catch (error) {
            handleAlertModal("許願失敗，請再試一次");
            console.log("錯誤", error);
        }
    }

    function renderWishes() {
        return (
            <WishContainer>
                {wishes &&
                    usersInfo &&
                    wishes.map(wish => {
                        return (
                            <CourseCard key={wish.id}>
                                <UserPhoto
                                    src={findUserInfo(wish.userID, "photo")}
                                    alt={findUserInfo(wish.userID, "name")}
                                />
                                <InfoArea>
                                    <Info>
                                        {findUserInfo(wish.userID, "name")}
                                    </Info>
                                </InfoArea>
                                <ContentArea>
                                    <TeacherName>{wish.content}</TeacherName>
                                </ContentArea>
                            </CourseCard>
                        );
                    })}
            </WishContainer>
        );
    }

    console.log(lasWishSnapshotRef.current);

    return (
        <>
            {!usersInfo || !wishes ? (
                <Loading />
            ) : (
                <Container>
                    <InputArea>
                        <TextInput
                            value={wishingContent}
                            handleChange={handleChange}
                            name="content"
                            placeholder={"請輸入你/妳的願望..."}
                        />
                        <Button onClick={makeWish}>我要許願</Button>
                    </InputArea>
                    <Title>許願池</Title>
                    {renderWishes()}
                    {lasWishSnapshotRef.current ? "下滑看更多" : "最後囉"}
                    <Waypoint
                        onEnter={() =>
                            loadingNextWishes(lasWishSnapshotRef.current)
                        }
                    />
                </Container>
            )}

            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
};
