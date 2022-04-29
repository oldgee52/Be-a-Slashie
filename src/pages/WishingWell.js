import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "../Component/TextInput";
import styled from "styled-components";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import firebaseInit from "../utils/firebase";
import { Waypoint } from "react-waypoint";
import { breakPoint } from "../utils/breakPoint";
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    padding: 80px 10px 0px 10px;

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
        max-width: 1200px;
    }
`;

const Background = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
`;
const Button = styled.button`
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background-color: #ff6100;

    cursor: pointer;

    margin-top: 20px;
    margin-bottom: 20px;

    @media ${breakPoint.desktop} {
    }
`;

const InputArea = styled.div`
    width: 100%;
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
    background-color: white;
    border: 1px solid white;
    border-radius: 5px;

    padding-bottom: 20px;
    border-bottom: 3px solid rgb(0 190 164);

    @media ${breakPoint.desktop} {
        flex-direction: column;
        align-items: center;
        border: 2px solid black;
        border-radius: 5px;
        border-bottom: 10px solid black;
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
        order: 0;
        padding: 0;
    }
`;

const InfoArea = styled.div`
    width: calc(100% - 80px);
`;

const Info = styled.p`
    color: #7f7f7f;
    font-size: 14px;
    margin-top: 10px;
    @media ${breakPoint.desktop} {
        font-size: 18px;
        margin-top: 10px;
    }
`;

const CourseName = styled.h4`
    width: 60vw;
    font-size: 20px;
    font-weight: 700;
    word-wrap: break-word;

    margin-bottom: 10px;
    @media ${breakPoint.desktop} {
        width: inherit;
        font-size: 24px;
        padding-top: 40px;
        height: 120px;
        word-wrap: break-word;
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

export const WishingWell = () => {
    const [wishingContent, setWishingContent] = useState({
        type: "",
        content: "",
    });
    const [wishes, setWishes] = useState([]);
    const [usersInfo, setUsersInfo] = useState();

    const lasWishSnapshotRef = useRef();
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

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
        let data = { ...wishingContent };
        data[e.target.name] = e.target.value;
        setWishingContent(data);
    }

    async function makeWish() {
        if (!wishingContent.type.trim() || !wishingContent.content.trim())
            return window.alert("請輸入內容");
        try {
            const coursesRef = collection(firebaseInit.db, "wishingWells");
            const docRef = doc(coursesRef);

            const data = {
                ...wishingContent,
                creatDate: Timestamp.now(),
                userID: studentID,
                id: docRef.id,
            };
            await setDoc(docRef, data);

            setWishingContent({
                type: "",
                content: "",
            });
            setWishes([data, ...wishes]);
            window.alert("許願成功");
        } catch (error) {
            window.alert("許願失敗，請再試一次");
            console.log("錯誤", error);
        }
    }

    function renderWishes() {
        return (
            <>
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
                                    <Info>
                                        {new Date(
                                            wish.creatDate.toDate(),
                                        ).toLocaleDateString()}
                                    </Info>
                                </InfoArea>
                                <ContentArea>
                                    <TeacherName>{wish.content}</TeacherName>
                                </ContentArea>
                            </CourseCard>
                        );
                    })}
            </>
        );
    }

    return (
        <Background>
            <Container>
                {!usersInfo || !wishes ? (
                    "loading..."
                ) : (
                    <>
                        <InputArea>
                            <TextInput
                                value={wishingContent.content}
                                handleChange={handleChange}
                                name="content"
                                placeholder={"請輸入你/妳的願望..."}
                            />
                            <Button onClick={makeWish}>我要許願</Button>
                        </InputArea>
                        <Title>許願池</Title>
                        {renderWishes()}
                        <Waypoint
                            onEnter={() =>
                                loadingNextWishes(lasWishSnapshotRef.current)
                            }
                        />
                    </>
                )}
            </Container>
        </Background>
    );
};
