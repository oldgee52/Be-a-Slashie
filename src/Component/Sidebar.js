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
import { BiLogOut } from "react-icons/bi";

const SidebarContainer = styled.nav`
    width: 100%;
    height: 50px;
    background-color: whitesmoke;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 5;
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
    top: ${props => (props.show ? "50px" : "-50px")};
    z-index: 5;

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
    display: ${props => (props.show ? "block" : "none")};
    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const LogoImg = styled.img`
    width: 150px;
    margin-top: 5px;
    margin-left: 15px;
    cursor: pointer;
`;

const MenuImg = styled.img`
    width: 20px;
    height: 20px;
    margin-top: 15px;
    margin-right: 15px;
    cursor: pointer;
    @media ${breakPoint.desktop} {
        display: none;
    }
`;

const ProfileImg = styled(MenuImg)`
    margin-right: 30px;
    @media ${breakPoint.desktop} {
        display: initial;
    }
`;

const SidebarContent = styled.div`
    font-size: 16px;
    color: ${props => (props.active ? "#ff6100" : "#7f7f7f")};
    padding: 10px;
`;

const RightArea = styled.div`
    display: flex;
`;
const SignOutArea = styled.div`
    align-self: center;
    margin-right: 30px;
    cursor: pointer;
`;

const NewBiLogOut = styled(BiLogOut)`
    width: 25px;
    height: 25px;
`;

function Sidebar({ userID }) {
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();

    function handleMobileNavShow() {
        setIsShow(prev => !prev);
    }

    function handleLinkToOtherRouterNavShow() {
        if (isShow) setIsShow(false);
    }

    function handleSignOut() {
        signOut(firebaseInit.auth)
            .then(() => {
                window.alert("已登出成功");
                navigate("/");
            })
            .catch(error => {
                window.alert(error);
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
            <SidebarContainer>
                <NavLink to="/">
                    <LogoImg
                        src={logo}
                        alt="logo"
                        onClick={handleLinkToOtherRouterNavShow}
                    />
                </NavLink>

                <MobileItemContainer show={isShow}>
                    {narbarRouter.map(router => (
                        <NavLink to={router.link} key={router.link}>
                            {({ isActive }) => (
                                <SidebarContent
                                    active={isActive}
                                    onClick={handleLinkToOtherRouterNavShow}
                                >
                                    {router.title}
                                </SidebarContent>
                            )}
                        </NavLink>
                    ))}
                </MobileItemContainer>
                <RightArea>
                    {userID && (
                        <SignOutArea
                            onClick={() => {
                                handleLinkToOtherRouterNavShow();
                                handleSignOut();
                            }}
                        >
                            <NewBiLogOut viewBox="0 -1 24 24" />
                        </SignOutArea>
                    )}
                    <NavLink to="personal/profile">
                        <ProfileImg
                            src={profile}
                            alt="個人資料"
                            onClick={handleLinkToOtherRouterNavShow}
                        />
                    </NavLink>
                    <MenuImg
                        src={isShow ? cross : hamburger_menu}
                        onClick={handleMobileNavShow}
                        alt="menu"
                    />
                </RightArea>
            </SidebarContainer>
        </>
    );
}

export default Sidebar;
