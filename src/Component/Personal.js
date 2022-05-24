import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { breakPoint } from "../utils/breakPoint";
import { Footer } from "./Footer";

const Container = styled.div`
    margin: auto;
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 10px;
    align-content: flex-start;
    min-height: calc(100vh - 180px);

    @media ${breakPoint.desktop} {
        max-width: 1200px;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0 20px 0 20px;
        min-height: calc(100vh - 135px);
    }
`;

const TitleArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    font-size: 14px;

    @media ${breakPoint.desktop} {
        width: 10%;
        flex-direction: column;
        font-size: 16px;
    }
`;

const SubTitleArea = styled(TitleArea)`
    font-size: 12px;
    @media ${breakPoint.desktop} {
        font-size: 16px;
        flex-direction: row;
        width: 60%;
        justify-content: flex-start;
        align-self: flex-start;

        margin-left: 20px;
    }
`;
const Title = styled.div`
    text-align: center;
    padding: 0 8px;
    color: ${prop => (prop.active ? "#ff6100" : "#505050")};
    border-right: ${prop => (prop.last ? "none" : "1px solid #7f7f7f")};
    cursor: pointer;

    @media ${breakPoint.desktop} {
        margin-bottom: 30px;
        padding-bottom: 10px;
        padding-top: 5px;
        border-right: none;
        border-bottom: ${prop =>
            prop.active ? "2px solid #ff6100" : "2px solid #7f7f7f"};
        border-left: ${prop =>
            prop.active ? "2px solid #ff6100" : "2px solid #7f7f7f"};
        transition-duration: 0.5s;
        padding-right: 0;
        border-bottom-left-radius: 5px;
        box-shadow: -1px 1px 0px 1px rgba(0, 0, 0, 0.2);
        &:hover {
            border-bottom: 2px solid #ff6100;
            border-left: 2px solid #ff6100;
        }
    }
`;
const SubTitle = styled.div`
    border-right: ${prop => (prop.last ? "none" : "1px solid #7f7f7f")};
    color: ${prop => (prop.active ? "#ff6100" : "#505050")};
    padding: 0 5px 0 5px;
    text-align: center;

    @media ${breakPoint.desktop} {
        padding: 5px 10px 10px 10px;
        margin-bottom: 0;
        border-bottom: ${prop =>
            prop.active ? "1px solid #ff6100" : "1px solid #7f7f7f"};
        border-right: ${prop =>
            prop.active ? "1px solid #ff6100" : "1px solid #7f7f7f"};
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 5px;
        border-left: none;
        margin-right: 10px;
        box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, 0.1);
        width: 110px;
        transition-duration: 0.5s;
        &:hover {
            border-bottom: ${prop =>
                prop.active ? "1px solid #ff6100" : "1px solid #7f7f7f"};
            border-left: none;
            box-shadow: 1px 1px 4px 4px rgba(0, 0, 0, 0.1);
        }
    }
`;
const Personal = () => {
    const [isActiveArea, setIsActiveArea] = useState();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            if (pathname.indexOf("student") !== -1)
                return setIsActiveArea("student");
            if (pathname.indexOf("teacher") !== -1)
                return setIsActiveArea("teacher");
            setIsActiveArea("profile");
        }
        return () => (isMounted = false);
    }, [pathname]);

    function handleRoleChange(role) {
        setIsActiveArea(role);
    }
    const studentRouter = [
        { link: "student-got-skill", title: "技能徽章", last: false },
        { link: "student-collection-course", title: "收藏課程", last: false },
        { link: "student-registered-course", title: "已報名課程", last: false },
        { link: "student-opening-course", title: "進行中課程", last: false },
        { link: "student-finished-course", title: "已完成課程", last: true },
    ];
    const teacherRouter = [
        { link: "teacher-upload-course", title: "上架課程", last: false },
        {
            link: "teacher-confirm-registration",
            title: "尚未開課程",
            last: false,
        },
        { link: "teacher-opening-course", title: "進行中課程", last: false },
        { link: "teacher-finished-course", title: "已完成課程", last: true },
    ];

    return (
        <>
            <Container>
                <TitleArea>
                    <NavLink
                        to="profile"
                        onClick={() => handleRoleChange("profile")}
                    >
                        <Title active={isActiveArea === "profile"} last={false}>
                            基本資料
                        </Title>
                    </NavLink>
                    <NavLink
                        to="student-got-skill"
                        onClick={() => handleRoleChange("student")}
                    >
                        <Title active={isActiveArea === "student"} last={false}>
                            我是學生
                        </Title>
                    </NavLink>
                    <NavLink
                        to="teacher-upload-course"
                        onClick={() => handleRoleChange("teacher")}
                    >
                        <Title active={isActiveArea === "teacher"} last={true}>
                            我是老師
                        </Title>
                    </NavLink>
                </TitleArea>
                {isActiveArea === "student" ? (
                    <SubTitleArea>
                        {studentRouter.map(router => (
                            <NavLink to={router.link} key={router.link}>
                                {({ isActive }) => (
                                    <SubTitle
                                        active={isActive}
                                        last={router.last}
                                    >
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
                                    <SubTitle
                                        active={isActive}
                                        last={router.last}
                                    >
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
            <Footer />
        </>
    );
};

export default Personal;
