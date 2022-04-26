import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import firebaseInit from "../utils/firebase";
import { breakPoint } from "../utils/breakPoint";
import logo from "../images/logo.png";
import hamburger_menu from "../images/hamburger_menu.png";
import cross from "../images/cross.png";
import profile from "../images/profile.png";

const SidebarContainer = styled.div`
    width: 100%;
    height: 50px;
    background-color: gray;
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
    background-color: gray;

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
    font-size: 18px;
    line-height: 27px;
    color: #ffffff;
    padding: 10px;
`;

function Sidebar({ userID }) {
    const [isShow, setIsShow] = useState(false);

    function handleMobileNavShow() {
        setIsShow(prev => !prev);
    }

    function handleSignOut() {
        signOut(firebaseInit.auth)
            .then(() => {
                window.alert("已登出成功");
            })
            .catch(error => {
                window.alert(error);
            });
    }
    return (
        <>
            <NavShowBackground show={isShow} onClick={handleMobileNavShow} />
            <SidebarContainer>
                <NavLink to="/">
                    <LogoImg src={logo} alt="logo" />
                </NavLink>
                {/* <NavLink to="/teacher-upload-course">
                    <SidebarContent>老師上架課程</SidebarContent>
                </NavLink>
                <NavLink to="/teacher-confirm-registration">
                    <SidebarContent>老師同意報名</SidebarContent>
                </NavLink>
                <NavLink to="/teacher-opening-course">
                    <SidebarContent>老師進行中課程</SidebarContent>
                </NavLink>
                <NavLink to="/teacher-finished-course">
                    <SidebarContent>老師已完成課程</SidebarContent>
                </NavLink>
                <NavLink to="/student-registered-course">
                    <SidebarContent>學生已報名課程</SidebarContent>
                </NavLink>
                <NavLink to="/student-opening-course">
                    <SidebarContent>學生進行中課程</SidebarContent>
                </NavLink>
                <NavLink to="/student-finished-course">
                    <SidebarContent>學生已完成課程</SidebarContent>
                </NavLink>
                <NavLink to="/student-collection-course">
                    <SidebarContent>學生蒐藏課程</SidebarContent>
                </NavLink>
                <NavLink to="/student-got-skill">
                    <SidebarContent>學生技能徽章</SidebarContent>
                </NavLink> */}
                {/* <NavLink to="/search">
                    <SidebarContent>課程搜尋</SidebarContent>
                </NavLink>
                <NavLink to="/talented-person-search">
                    <SidebarContent>人才搜尋</SidebarContent>
                </NavLink>
                <NavLink to="/wishing-well">
                    <SidebarContent>許願池</SidebarContent>
                </NavLink> */}

                <MobileItemContainer show={isShow}>
                    <NavLink to="/search">
                        <SidebarContent>課程搜尋</SidebarContent>
                    </NavLink>
                    <NavLink to="/talented-person-search">
                        <SidebarContent>人才搜尋</SidebarContent>
                    </NavLink>
                    <NavLink to="/wishing-well">
                        <SidebarContent>許願池</SidebarContent>
                    </NavLink>
                </MobileItemContainer>
                <div>
                    <NavLink to="/profile">
                        <ProfileImg src={profile} alt="個人資料" />
                    </NavLink>
                    <MenuImg
                        src={isShow ? cross : hamburger_menu}
                        onClick={handleMobileNavShow}
                        alt="menu"
                    />
                </div>
                {userID && (
                    <SidebarContent onClick={handleSignOut}>
                        登出
                    </SidebarContent>
                )}
            </SidebarContainer>
        </>
    );
}

export default Sidebar;
