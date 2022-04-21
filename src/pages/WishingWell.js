import React, { useState } from "react";
import { TextInput } from "../Component/TextInput";
import styled from "styled-components";
import { addDoc, collection } from "firebase/firestore";
import { async } from "@firebase/util";
import firebaseInit from "../utils/firebase";
const Container = styled.div`
    margin: auto;
    margin-top: 100px;
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

export const WishingWell = () => {
    const [wishingContent, setWishingContent] = useState({
        type: "",
        content: "",
    });
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

    function handleChange(e) {
        let data = { ...wishingContent };
        data[e.target.name] = e.target.value;
        setWishingContent(data);
    }

    async function makeWish() {
        try {
            await addDoc(collection(firebaseInit.db, "wishingWells"), {
                ...wishingContent,
                creatDate: new Date(),
                userID: studentID,
            });

            window.alert("許願成功");
            setWishingContent({
                type: "",
                content: "",
            });
        } catch (error) {
            window.alert("許願失敗，請再試一次");
            console.log("錯誤", error);
        }
    }
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
        </Container>
    );
};
