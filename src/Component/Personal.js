import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";

const Container = styled.div`
    margin: auto;
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 10px;

    @media ${breakPoint.desktop} {
        max-width: 1200px;
        justify-content: flex-start;
        padding: 0 20px 0 20px;
    }
`;

const TitleArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    color: #7f7f7f;

    @media ${breakPoint.desktop} {
        width: 10%;
        flex-direction: column;
    }
`;

const SubTitleArea = styled(TitleArea)`
    @media ${breakPoint.desktop} {
        flex-direction: row;
        width: 60%;
        justify-content: flex-start;
        align-self: flex-start;

        margin-left: 20px;
    }
`;
const Title = styled.div`
    font-size: 12px;
    text-align: center;
    padding-right: 15px;
    color: ${prop => (prop.active ? "#ff6100" : "inherit")};

    cursor: pointer;

    @media ${breakPoint.desktop} {
        margin-bottom: 30px;
        padding-bottom: 10px;
        border-bottom: 1px solid black;
        padding-right: 0;
    }
`;
const SubTitle = styled(Title)`
    border-left: 1px solid black;
    padding: 0 5px 0 5px;

    &:first-child {
        border-left: none;
    }
    @media ${breakPoint.desktop} {
        padding: 0 10px 0 10px;
        margin-bottom: 0;
        border-bottom: none;
    }
`;
export const Personal = () => {
    const [isActiveArea, setIsActiveArea] = useState();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        if (pathname.indexOf("student") !== -1)
            return setIsActiveArea("student");
        if (pathname.indexOf("teacher") !== -1)
            return setIsActiveArea("teacher");
        setIsActiveArea("profile");
    }, [pathname]);

    function handleRoleChange(role) {
        setIsActiveArea(role);
    }
    const studentRouter = [
        { link: "student-got-skill", title: "技能徽章" },
        { link: "student-collection-course", title: "收藏課程" },
        { link: "student-registered-course", title: "已報名課程" },
        { link: "student-opening-course", title: "進行中課程" },
        { link: "student-finished-course", title: "已完成課程" },
    ];
    const teacherRouter = [
        { link: "teacher-upload-course", title: "上架課程" },
        { link: "teacher-confirm-registration", title: "尚未開課程" },
        { link: "teacher-opening-course", title: "進行中課程" },
        { link: "teacher-finished-course", title: "已完成課程" },
    ];

    return (
        <Container>
            <TitleArea>
                <NavLink
                    to="profile"
                    onClick={() => handleRoleChange("profile")}
                >
                    <Title active={isActiveArea === "profile"}>基本資料</Title>
                </NavLink>
                <NavLink
                    to="student-got-skill"
                    onClick={() => handleRoleChange("student")}
                >
                    <Title active={isActiveArea === "student"}>我是學生</Title>
                </NavLink>
                <NavLink
                    to="teacher-upload-course"
                    onClick={() => handleRoleChange("teacher")}
                >
                    <Title active={isActiveArea === "teacher"}>我是老師</Title>
                </NavLink>
            </TitleArea>
            {isActiveArea === "student" ? (
                <SubTitleArea>
                    {studentRouter.map(router => (
                        <NavLink to={router.link} key={router.link}>
                            {({ isActive }) => (
                                <SubTitle active={isActive}>
                                    {router.title}
                                </SubTitle>
                            )}
                        </NavLink>
                    ))}
                </SubTitleArea>
            ) : (
                ""
            )}
            {isActiveArea === "teacher" ? (
                <SubTitleArea>
                    {teacherRouter.map(router => (
                        <NavLink to={router.link} key={router.link}>
                            {({ isActive }) => (
                                <SubTitle active={isActive}>
                                    {router.title}
                                </SubTitle>
                            )}
                        </NavLink>
                    ))}
                </SubTitleArea>
            ) : (
                ""
            )}
            <Outlet />
        </Container>
    );
};
