import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import { TextInput } from "../Component/TextInput";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { MyButton } from "../Component/MyButton";

const Container = styled.div`
    margin: 180px auto 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    min-width: 300px;
    max-width: 400px;
    height: 350px;
    padding: 20px;
    background-color: whitesmoke;
    border-radius: 10px;
`;

const SignInDiv = styled.div`
    width: 50%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: ${props => (props.login ? "#ff6100" : "none")};
    color: ${props => (props.login ? "white" : "black")};
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    transition-duration: 0.5s;
    cursor: pointer;
`;

const SingUpDiv = styled.div`
    width: 50%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: ${props => (!props.login ? "#ff6100" : "none")};
    color: ${props => (!props.login ? "white" : "black")};
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    transition-duration: 0.5s;
    cursor: pointer;
`;

export const Login = ({ userLogin }) => {
    const [info, setInfo] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    useEffect(() => {
        if (userLogin === "in") navigate(from, { replace: true });
    });

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
                    photo: "https://firebasestorage.googleapis.com/v0/b/be-a-slashie.appspot.com/o/photo-C%3A%5Cfakepath%5Cprofile.png?alt=media&token=7bfb27e7-5b32-454c-8182-446383794d95",
                    selfIntroduction: "成為斜槓人生的路上，有你我相伴。",
                });
                window.alert("註冊成功，可以去個人修改大頭照跟自我介紹喔");
            })
            .then(() => navigate(from, { replace: true }))
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
            {userLogin === "check" ? (
                "身分驗證中"
            ) : (
                <>
                    <SignInDiv
                        onClick={() => {
                            setIsLogin(true);
                            setInfo({
                                email: "",
                                password: "",
                                name: "",
                            });
                        }}
                        login={isLogin}
                    >
                        登入
                    </SignInDiv>
                    <SingUpDiv
                        onClick={() => {
                            setIsLogin(false);
                            setInfo({
                                email: "",
                                password: "",
                                name: "",
                            });
                        }}
                        login={isLogin}
                    >
                        註冊
                    </SingUpDiv>

                    <TextInput
                        value={info.email}
                        handleChange={handleChange}
                        name="email"
                        placeholder="請輸入信箱"
                    />
                    <TextInput
                        value={info.password}
                        handleChange={handleChange}
                        name="password"
                        type="password"
                        placeholder="請輸入密碼"
                    />
                    {!isLogin && (
                        <TextInput
                            value={info.name}
                            handleChange={handleChange}
                            name="name"
                            placeholder="請輸入姓名"
                        />
                    )}
                    {isLogin && (
                        <MyButton
                            clickFunction={signIn}
                            buttonWord="登入"
                            isDisabled={!info.password || !info.email}
                            width="100%"
                        />
                    )}
                    {!isLogin && (
                        <MyButton
                            clickFunction={singUp}
                            buttonWord="註冊"
                            isDisabled={Object.values(info).some(
                                value => !value,
                            )}
                            width="100%"
                        />
                    )}
                </>
            )}
        </Container>
    );
};
