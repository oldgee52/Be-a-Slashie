import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import firebaseInit from "../utils/firebase";
import { breakPoint } from "../utils/breakPoint";
import logo from "../images/logo.png";
import hamburger_menu from "../images/hamburger_menu.png";
import cross from "../images/cross.png";
import profile from "../images/profile.png";
import { BiLogOut, BiUser } from "react-icons/bi";
import { AlertModal } from "./AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";
import { keyframes } from "styled-components";

const HeaderContainer = styled.nav`
    width: 100%;
    height: 50px;
    background-color: whitesmoke;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 6;
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;

const MobileItemContainer = styled.div`
    width: 100%;
    height: 50px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: whitesmoke;

    position: fixed;
    top: 50px;
    right: ${props => (props.show ? "0" : "-1000px")};
    z-index: 5;
    transition-duration: 0.5s;

    @media ${breakPoint.desktop} {
        display: flex;
        position: initial;
        width: auto;
        justify-content: flex-start;
        align-items: center;
        z-index: 10;
        margin-right: auto;
    }
`;

const NavShowBackground = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    z-index: 4;
    right: ${props => (props.show ? "0" : "-1000px")};
    /* z-index: ${props => (props.show ? "4" : "-10")}; */
    /* display: ${props => (props.show ? "block" : "none")}; */
    /* opacity: ${props => (props.show ? "1" : "0")}; */
    transition-duration: 0.5s;
    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const LogoImg = styled.img`
    width: 120px;
    margin-top: -18px;

    margin-left: 15px;
    cursor: pointer;
`;

const MenuImg = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 15px;
    margin-top: 3px;
    cursor: pointer;
    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const circle = keyframes`
    0% {
        width: 1px;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        height: 1px;
        z-index: -1;
        background: #eee;
        border-radius: 100%;
    }
    100% {
        background: rgba(0,0,0,0.1);
        height: 5000%;
        width: 5000%;
        z-index: -1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 0;
    }`;

const HeaderContent = styled.div`
    font-size: 16px;
    height: 50px;
    line-height: 28px;
    color: ${props => (props.active ? "#ff6100" : "#505050")};
    background: ${props => (props.active ? "rgba(0,0,0,0.1)" : "none")};
    padding: 10px;
    z-index: 1;
    overflow: hidden;

    &:hover {
        color: #ff6100;
    }
    &:after {
        display: block;
        position: absolute;
        margin: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        content: ".";
        color: transparent;
        width: 1px;
        height: 1px;
        border-radius: 50%;
        background: transparent;
    }
    &:hover:after {
        animation: ${circle} 1.5s ease-in forwards;
    }
`;

const RightArea = styled.div`
    display: flex;
    align-items: center;
`;

const RightAreaBox = styled.div`
    align-self: center;
    margin-right: 15px;

    width: 33px;
    height: 25px;
    overflow: hidden;
    cursor: pointer;

    transition-duration: ${props => props.duration};
    @media ${breakPoint.desktop} {
        &:hover {
            width: ${props => props.maxWidth};
        }
    }
`;

const NewBiLogOut = styled(BiLogOut)`
    width: 25px;
    height: 25px;
`;

const NewBiUser = styled(BiUser)`
    width: 25px;
    height: 25px;
`;
const NewNavLink = styled(NavLink)`
    width: 33.3%;
    text-align: center;
    @media ${breakPoint.desktop} {
        width: 100px;
    }
`;

const RightAreaBoxTitle = styled.span`
    line-height: 1.6;
    padding-left: 10px;
`;

function Header({ userID }) {
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();

    function handleMobileNavShow() {
        setIsShow(prev => !prev);
    }

    function handleLinkToOtherRouterNavShow() {
        if (isShow) setIsShow(false);
    }

    function handleSignOut() {
        signOut(firebaseInit.auth)
            .then(() => {
                handleAlertModal("已登出成功");
                navigate("/");
            })
            .catch(error => {
                handleAlertModal(error);
            });
    }

    const narbarRouter = [
        { link: "search", title: "課程搜尋" },
        { link: "talented-person-search", title: "人才搜尋" },
        { link: "wishing-well", title: "許願池" },
    ];
    return (
        <>
            <NavShowBackground show={isShow} onClick={handleMobileNavShow} />
            <HeaderContainer>
                <NavLink to="/">
                    <LogoImg
                        src={logo}
                        alt="logo"
                        onClick={handleLinkToOtherRouterNavShow}
                    />
                </NavLink>

                <MobileItemContainer show={isShow}>
                    {narbarRouter.map(router => (
                        <NewNavLink to={router.link} key={router.link}>
                            {({ isActive }) => (
                                <HeaderContent
                                    active={isActive}
                                    onClick={handleLinkToOtherRouterNavShow}
                                >
                                    {router.title}
                                </HeaderContent>
                            )}
                        </NewNavLink>
                    ))}
                </MobileItemContainer>
                <RightArea>
                    {userID && (
                        <RightAreaBox
                            onClick={() => {
                                handleLinkToOtherRouterNavShow();
                                handleSignOut();
                            }}
                            maxWidth="70px"
                            duration="0.2s"
                        >
                            <NewBiLogOut viewBox="0 -1 24 24" />
                            <RightAreaBoxTitle>登出</RightAreaBoxTitle>
                        </RightAreaBox>
                    )}
                    <NavLink to="personal/profile">
                        <RightAreaBox
                            onClick={handleLinkToOtherRouterNavShow}
                            maxWidth={userID ? "105px" : "70px"}
                            duration={userID ? "0.4s" : "0.2s"}
                        >
                            <NewBiUser viewBox="0 -1 24 24" />
                            <RightAreaBoxTitle>
                                {userID ? "個人資料" : "登入"}
                            </RightAreaBoxTitle>
                        </RightAreaBox>
                    </NavLink>

                    <MenuImg
                        src={isShow ? cross : hamburger_menu}
                        onClick={handleMobileNavShow}
                        alt="menu"
                    />
                </RightArea>
            </HeaderContainer>
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
}

export default Header;
