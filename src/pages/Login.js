import React, { useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { TextInput } from "../Component/TextInput";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

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

export const Login = ({ userID }) => {
    const [info, setInfo] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [login, setLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    function singUp() {
        if (!info.email.trim() || !info.password.trim() || !info.name.trim())
            return window.alert("請輸入完整資料");

        createUserWithEmailAndPassword(
            firebaseInit.auth,
            info.email,
            info.password,
        )
            .then(async userCredential => {
                const user = userCredential.user;

                await setDoc(doc(firebaseInit.db, "users", user.uid), {
                    email: user.email,
                    uid: user.uid,
                    name: info.name,
                    photo: "https://upload.cc/i1/2022/04/09/KT0J1k.png",
                    selfIntroduction: "",
                });
                setInfo({
                    email: "",
                    password: "",
                    name: "",
                });
                window.alert("註冊成功，可以去個人修改大頭照跟自我介紹喔");
                navigate(from, { replace: true });
            })
            .catch(error => {
                const errorCode = error.code;
                console.log(errorCode);
                switch (errorCode) {
                    case "auth/invalid-email":
                        window.alert(`輸入信箱格式有誤`);
                        break;
                    case "auth/weak-password":
                        window.alert(`密碼規格不符(至少6字元)`);
                        break;
                    case "auth/email-already-in-use":
                        window.alert(`已經註冊過囉，直接登入就好`);
                        break;
                    case "auth/too-many-requests":
                        window.alert(`試太多次囉，請等五分鐘後作業`);
                        break;
                    default:
                        window.alert(errorCode);
                }
            });
    }

    function signIn() {
        signInWithEmailAndPassword(firebaseInit.auth, info.email, info.password)
            .then(() => {
                setInfo({
                    email: "",
                    password: "",
                    name: "",
                });
                window.alert("登入成功");
                navigate(from, { replace: true });
            })
            .catch(error => {
                const errorCode = error.code;

                switch (errorCode) {
                    case "auth/invalid-email":
                        window.alert(`輸入信箱格式有誤`);
                        break;
                    case "auth/wrong-password":
                        window.alert(`輸入密碼有誤`);
                        break;
                    case "auth/user-not-found":
                        window.alert(`我不認得您，請先註冊`);
                        break;
                    case "auth/too-many-requests":
                        window.alert(`試太多次囉，請等五分鐘後作業`);
                        break;
                    default:
                        window.alert(errorCode);
                }
            });
    }

    function handleChange(e) {
        let data = { ...info };
        data[e.target.name] = e.target.value;
        setInfo(data);
    }

    return (
        <Container>
            <div onClick={() => setLogin(false)}>註冊</div>
            <div onClick={() => setLogin(true)}>登入</div>
            <TextInput
                title="信箱"
                value={info.email}
                handleChange={handleChange}
                name="email"
            />
            <TextInput
                title="密碼"
                value={info.password}
                handleChange={handleChange}
                name="password"
                type="password"
            />
            {!login && (
                <TextInput
                    title="姓名"
                    value={info.name}
                    handleChange={handleChange}
                    name="name"
                />
            )}
            {login && <button onClick={signIn}>登入</button>}
            {!login && <button onClick={singUp}>註冊</button>}
        </Container>
    );
};
