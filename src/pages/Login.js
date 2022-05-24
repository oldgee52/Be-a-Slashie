import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import PropTypes from "prop-types";
import TextInput from "../Component/TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import MyButton from "../Component/MyButton";
import AlertModal from "../Component/AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";
import { Footer } from "../Component/Footer";
import { breakPoint } from "../utils/breakPoint";
import { Loading } from "../Component/Loading";
import { handleChangeForObject } from "../utils/functions";

const Box = styled.div`
    min-height: calc(100vh - 150px);
    margin: 100px auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    @media ${breakPoint.desktop} {
        min-height: calc(100vh - 155px);
    }
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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
    background: ${props =>
        props.login
            ? "linear-gradient(to left,#ff8f08 -10.47%,#ff6700 65.84%)"
            : "none"};
    color: ${props => (props.login ? "white" : "inherit")};
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    transition-duration: 0.5s;
    cursor: pointer;
    align-self: flex-start;
`;

const SingUpDiv = styled.div`
    width: 50%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: ${props =>
        !props.login
            ? "linear-gradient(to right,#ff8f08 -10.47%,#ff6700 65.84%)"
            : "none"};
    color: ${props => (!props.login ? "white" : "inherit")};
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    transition-duration: 0.5s;
    cursor: pointer;
    align-self: flex-start;
`;

const Login = ({ userLogin }) => {
    const [info, setInfo] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [isLogin, setIsLogin] = useState(true);
    const [isNavigate, setIsNavigate] = useState(false);
    const [isAutoNavigate, setIsAutoNavigate] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();

    const from = location.state?.from || "/";

    useEffect(() => {
        if (isAutoNavigate && userLogin === "in")
            navigate(from, { replace: true });
    }, [isAutoNavigate, userLogin]);

    function handleErrorMessage(errorCode) {
        const errorStatus = {
            "auth/invalid-email": "輸入信箱格式有誤",
            "auth/weak-password": "密碼規格不符(至少6字元)",
            "auth/wrong-password": `輸入密碼有誤`,
            "auth/email-already-in-use": "已經註冊過囉，直接登入就好",
            "auth/too-many-requests": "試太多次囉，請等五分鐘後作業",
            "auth/user-not-found": `我不認得您，請先註冊`,
        };
        return (
            errorStatus[errorCode] ||
            `${errorCode}-請將此畫面截圖並mail給我們，謝謝！`
        );
    }

    function singUp() {
        setIsAutoNavigate(false);
        const { email, password, name } = info;
        firebaseInit
            .handleEmailSingUp(email, password, name)
            .then(() => {
                setIsNavigate(true);
                handleAlertModal("註冊成功，可以去個人修改大頭照跟自我介紹喔");
            })
            .catch(error => {
                const errorCode = error.code;
                handleAlertModal(handleErrorMessage(errorCode));
                if (errorCode === "auth/email-already-in-use") setIsLogin(true);
            });
    }

    function signIn() {
        setIsAutoNavigate(false);
        firebaseInit
            .handleSingInWithEmail(info.email, info.password)
            .then(() => {
                setIsNavigate(true);
                handleAlertModal("登入成功");
            })
            .catch(error => {
                const errorCode = error.code;
                handleAlertModal(handleErrorMessage(errorCode));
                if (errorCode === "auth/user-not-found") setIsLogin(false);
            });
    }
    const handleInputChange = e =>
        handleChangeForObject(info, e.target.name, e.target.value, setInfo);

    return (
        <>
            <Box>
                {userLogin === "check" ? (
                    <Loading />
                ) : (
                    <Container>
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
                            handleChange={handleInputChange}
                            name="email"
                            placeholder="請輸入信箱"
                        />
                        <TextInput
                            value={info.password}
                            handleChange={handleInputChange}
                            name="password"
                            type="password"
                            placeholder="請輸入密碼"
                        />
                        {!isLogin && (
                            <TextInput
                                value={info.name}
                                handleChange={handleInputChange}
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
                    </Container>
                )}
            </Box>
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
                isNavigateToOtherRouter={isNavigate}
                pathname={from}
            />

            <Footer />
        </>
    );
};

Login.propTypes = {
    userLogin: PropTypes.string.isRequired,
};

export default Login;
