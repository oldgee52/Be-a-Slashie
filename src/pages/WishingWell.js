import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "../Component/TextInput";
import styled from "styled-components";
import {
    collection,
    doc,
    query,
    setDoc,
    orderBy,
    limit,
    startAfter,
    getDocs,
} from "firebase/firestore";
import firebaseInit from "../utils/firebase";
import { Waypoint } from "react-waypoint";
const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;
const Button = styled.button`
    width: 30%;
    height: 48px;
    text-align: center;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background-color: #f44336;
    border: none;
    cursor: pointer;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

const Div12 = styled(Div1)`
    border: 1px solid black;
`;
const Div13 = styled(Div1)`
    margin-bottom: 50px;
`;

const Div15 = styled(Div1)`
    height: 230px;
    overflow-x: hidden;
`;

export const WishingWell = () => {
    const [wishingContent, setWishingContent] = useState({
        type: "",
        content: "",
    });
    const [posts, setPosts] = useState([]);
    const [usersInfo, setUsersInfo] = useState();

    const lasWishSnapshotRef = useRef();
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

    useEffect(() => {
        (async function (db) {
            const q = query(
                collection(db, "wishingWells"),
                orderBy("creatDate", "desc"),
                limit(3),
            );
            const firstWishesSnapshot = await getDocs(q);
            const data = firstWishesSnapshot.docs.map(wish => {
                return wish.data();
            });
            console.log(data);
            lasWishSnapshotRef.current =
                firstWishesSnapshot.docs[firstWishesSnapshot.docs.length - 1];

            setPosts(data);
        })(firebaseInit.db);
    }, []);
    useEffect(() => {
        firebaseInit
            .getCollection(collection(firebaseInit.db, "users"))
            .then(data => {
                console.log(data);
                setUsersInfo(data);
            });
    }, []);

    async function loadingNextWishes(key) {
        if (key) {
            const q = query(
                collection(firebaseInit.db, "wishingWells"),
                orderBy("creatDate", "desc"),
                startAfter(key),
                limit(3),
            );
            const firstWishesSnapshot = await getDocs(q);
            const data = firstWishesSnapshot.docs.map(wish => {
                return wish.data();
            });
            console.log(data);
            lasWishSnapshotRef.current =
                firstWishesSnapshot.docs[firstWishesSnapshot.docs.length - 1];
            setPosts([...posts, ...data]);
        }
    }

    function findUserInfo(userID, info) {
        const result = usersInfo?.filter(array => array.uid === userID);

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
                creatDate: new Date(),
                userID: studentID,
                id: docRef.id,
            };
            await setDoc(docRef, data);

            setWishingContent({
                type: "",
                content: "",
            });
            setPosts([data, ...posts]);
            window.alert("許願成功");
        } catch (error) {
            window.alert("許願失敗，請再試一次");
            console.log("錯誤", error);
        }
    }

    const allPosts = (
        <div>
            {posts &&
                posts.map(post => {
                    return (
                        <Div12 key={post.id}>
                            <Div1>
                                日期:
                                {new Date(
                                    post.creatDate.seconds * 1000,
                                ).toLocaleDateString()}{" "}
                            </Div1>
                            <Div1>類型: {post.type}</Div1>
                            <Div1>內容: {post.content}</Div1>
                            <Div1>許願者姓名: {post.userID}</Div1>
                        </Div12>
                    );
                })}
        </div>
    );
    return (
        <Container>
            <TextInput
                title="類型"
                value={wishingContent.type}
                handleChange={handleChange}
                name="type"
            />
            <TextInput
                title="許願內容"
                value={wishingContent.content}
                handleChange={handleChange}
                name="content"
            />
            <Button onClick={makeWish}>我要許願</Button>
            <Div13>
                <h2>許願池</h2>
                <Div15>
                    <div>{allPosts}</div>
                    <Waypoint
                        onEnter={() =>
                            loadingNextWishes(lasWishSnapshotRef.current)
                        }
                    />
                    {lasWishSnapshotRef.current ? "下滑看更多" : "最後囉"}
                </Div15>
            </Div13>
        </Container>
    );
};
