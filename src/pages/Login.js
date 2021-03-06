import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import firebaseInit from "../utils/firebase";
import TextInput from "../Component/common/TextInput";
import MyButton from "../Component/common/MyButton";
import AlertModal from "../Component/common/AlertModal";
import useAlertModal from "../customHooks/useAlertModal";
import Footer from "../Component/Footer";
import Loading from "../Component/loading/Loading";
import breakPoint from "../utils/breakPoint";
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

function Login({ userLogin }) {
    const [info, setInfo] = useState({
        email: "test2@123.com",
        password: "123123",
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
            "auth/invalid-email": "????????????????????????",
            "auth/weak-password": "??????????????????(??????6??????)",
            "auth/wrong-password": `??????????????????`,
            "auth/email-already-in-use": "???????????????????????????????????????",
            "auth/too-many-requests": "??????????????????????????????????????????",
            "auth/user-not-found": `??????????????????????????????`,
        };
        return (
            errorStatus[errorCode] ||
            `${errorCode}-????????????????????????mail?????????????????????`
        );
    }

    function singUp() {
        setIsAutoNavigate(false);
        const { email, password, name } = info;
        firebaseInit
            .handleEmailSingUp(email, password, name)
            .then(() => {
                setIsNavigate(true);
                handleAlertModal("???????????????????????????????????????????????????????????????");
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
                handleAlertModal("????????????");
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
                                    email: "test2@123.com",
                                    password: "123123",
                                    name: "",
                                });
                            }}
                            login={isLogin}
                        >
                            ??????
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
                            ??????
                        </SingUpDiv>

                        <TextInput
                            value={info.email}
                            handleChange={handleInputChange}
                            name="email"
                            placeholder="???????????????"
                        />
                        <TextInput
                            value={info.password}
                            handleChange={handleInputChange}
                            name="password"
                            type="password"
                            placeholder="???????????????"
                        />
                        {!isLogin && (
                            <TextInput
                                value={info.name}
                                handleChange={handleInputChange}
                                name="name"
                                placeholder="???????????????"
                            />
                        )}
                        {isLogin && (
                            <MyButton
                                clickFunction={() => signIn()}
                                buttonWord="??????"
                                isDisabled={!info.password || !info.email}
                                width="100%"
                            />
                        )}
                        {!isLogin && (
                            <MyButton
                                clickFunction={() => singUp()}
                                buttonWord="??????"
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
}

Login.propTypes = {
    userLogin: PropTypes.string.isRequired,
};

export default Login;
