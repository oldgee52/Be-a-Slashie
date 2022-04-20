import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const SidebarContainer = styled.div`
    width: 300px;
    height: 896px;
    background-color: #f44336;

    position: fixed;
    top: 0;
    left: 0;
    @media (max-width: 992px) {
        display: ${props => (props.isActive ? "block" : "none")};
        height: 100%;
    }
`;

const SidebarContent = styled.div`
    width: 204px;
    height: 24px;

    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: #ffffff;

    padding: 20px;
`;

function Sidebar() {
    return (
        <>
            <SidebarContainer>
                <NavLink to="/">
                    <SidebarContent>Home</SidebarContent>
                </NavLink>
                <NavLink to="/teacher-upload-course">
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
                <NavLink to="/search">
                    <SidebarContent>搜尋</SidebarContent>
                </NavLink>
                <NavLink to="/profile">
                    <SidebarContent>個人資料頁</SidebarContent>
                </NavLink>
            </SidebarContainer>
        </>
    );
}

export default Sidebar;
