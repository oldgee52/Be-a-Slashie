import React, { useEffect, useRef, useState } from "react";
import TextInput from "../Component/TextInput";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { Waypoint } from "react-waypoint";
import { breakPoint } from "../utils/breakPoint";
import { useAlertModal } from "../customHooks/useAlertModal";
import AlertModal from "../Component/AlertModal";
import { Loading } from "../Component/Loading";
import { Footer } from "../Component/Footer";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useUserInfo } from "../customHooks/useUserInfo";
import PropTypes from "prop-types";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    align-content: flex-start;

    padding: 80px 10px 0px 10px;
    min-height: 100vh;

    @media ${breakPoint.desktop} {
        margin: auto;
        margin-bottom: 50px;
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
    background: linear-gradient(to left, #ff8f08 -10.47%, #ff6700 65.84%);

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
const DirectionBox = styled.div`
    width: 100%;
    background-color: whitesmoke;
    border-radius: 5px;
    padding: 10px;
    padding-left: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`;
const Title = styled.div`
    font-size: 20px;
    letter-spacing: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 100%;
    @media ${breakPoint.desktop} {
        font-size: 24px;
    }
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
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
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
    font-size: 16px;
    margin-top: 22px;
    @media ${breakPoint.desktop} {
        margin-top: 20px;
    }
`;

const TeacherName = styled.p`
    color: #7f7f7f;

    line-height: 20px;
    margin-top: 5px;
    width: calc(100% - 40px);
    @media ${breakPoint.desktop} {
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
const NewBsHeart = styled(BsHeart)`
    width: 12px;
    height: 12px;
`;
const NewBsHeartFill = styled(BsHeartFill)`
    width: 12px;
    height: 12px;
    color: #ff6100;
`;
const HeartBox = styled.div`
    width: 40px;
    text-align: right;
    cursor: pointer;
`;

const LikeNumber = styled.span`
    font-size: 12px;
    line-height: 15.5px;
    padding-left: 8px;
    color: #7f7f7f;
`;

const WishDirection = styled.div`
    font-size: 18px;
`;

const WishDirectionSpan = styled.span`
    color: #ff6100;
`;

const WishingWell = ({ userID }) => {
    const [wishingContent, setWishingContent] = useState("");
    const [wishes, setWishes] = useState([]);
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const [findUserInfo, usersInfo] = useUserInfo();
    const lasWishSnapshotRef = useRef();

    useEffect(() => {
        firebaseInit.getFirstBatchWishes().then(data => {
            lasWishSnapshotRef.current = data.lastKey;
            setWishes(data.wishes);
        });
    }, []);

    async function loadingNextWishes(key) {
        if (key) {
            firebaseInit.getNextBatchWishes(key).then(data => {
                lasWishSnapshotRef.current = data.lastKey;
                setWishes([...wishes, ...data.wishes]);
            });
        }
    }

    function handleChange(e) {
        setWishingContent(e.target.value);
    }

    async function makeWish() {
        if (!wishingContent.trim()) return handleAlertModal("請輸入內容");
        try {
            const wishData = await firebaseInit.setDocForMakeWish(
                wishingContent,
                userID,
            );
            setWishingContent("");
            setWishes([wishData, ...wishes]);
            handleAlertModal("許願成功");
        } catch (error) {
            handleAlertModal("許願失敗，請再試一次");
            console.log("錯誤", error);
        }
    }

    async function handleAddLike(wishId, index, condition) {
        firebaseInit
            .updateDocForHandleWishLike(wishId, userID, condition)
            .then(() => {
                let data = [...wishes];
                if (condition) {
                    const newLikeList = data[index]["like"].filter(
                        user => user !== userID,
                    );
                    data[index]["like"] = newLikeList;
                    return setWishes(data);
                }
                if (!condition) {
                    if (data[index]["like"]) {
                        data[index]["like"] = [...data[index]["like"], userID];
                    }
                    if (!data[index]["like"]) {
                        data[index]["like"] = [userID];
                    }
                    setWishes(data);
                }
            })
            .catch(error => {
                console.log(error);
                handleAlertModal("發生錯誤，請再試一次");
            });
    }

    function isUserLikeThisWish(likes) {
        return likes?.some(uid => uid === userID);
    }

    function renderWishes() {
        return (
            <WishContainer>
                {wishes &&
                    wishes.map((wish, index) => {
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
                                    <HeartBox
                                        onClick={() => {
                                            handleAddLike(
                                                wish.id,
                                                index,
                                                isUserLikeThisWish(wish.like),
                                            );
                                        }}
                                    >
                                        {isUserLikeThisWish(wish.like) ? (
                                            <NewBsHeartFill />
                                        ) : (
                                            <NewBsHeart />
                                        )}

                                        <LikeNumber>
                                            {wish.like ? wish.like.length : 0}
                                        </LikeNumber>
                                    </HeartBox>
                                </ContentArea>
                            </CourseCard>
                        );
                    })}
            </WishContainer>
        );
    }

    return (
        <>
            {!wishes || !usersInfo ? (
                <Loading />
            ) : (
                <>
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
                        <DirectionBox>
                            <Title>
                                <span>
                                    <BsHeart viewBox="0 -3 18 18" />
                                </span>{" "}
                                許願成真
                            </Title>
                            <WishDirection>
                                如果願望累積到{" "}
                                <WishDirectionSpan>10個 </WishDirectionSpan>
                                <WishDirectionSpan>
                                    <BsHeartFill viewBox="0 -2 18 18" />
                                </WishDirectionSpan>
                                ，將為大家找老師來開課!
                            </WishDirection>
                        </DirectionBox>
                        {renderWishes()}
                        <Waypoint
                            onEnter={() =>
                                loadingNextWishes(lasWishSnapshotRef.current)
                            }
                        />
                    </Container>
                    <Footer />
                </>
            )}

            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
};

WishingWell.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default WishingWell;
