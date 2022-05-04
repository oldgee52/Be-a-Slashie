import { collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CheckSkills } from "../Component/CheckSkills";
import PaginatedItems from "../Component/Paginate";
import { SearchInput } from "../Component/SearchInput";
import { breakPoint } from "../utils/breakPoint";
import firebaseInit from "../utils/firebase";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;

    padding: 80px 10px;

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
        max-width: 1200px;
    }
`;

const SearchInputBox = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        width: 400px;
    }
`;

const SkillsBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    margin: 10px 0 10px 10px;
    /* color: #7f7f7f; */

    @media ${breakPoint.desktop} {
        margin-bottom: 0;
    }
`;

const SkillFilter = styled.div`
    color: #7f7f7f;
    font-weight: 600;
    letter-spacing: 1px;
    width: 100%;
`;

const SearchArea = styled.div`
    width: 100%;
`;

const Card = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    margin-top: 10px;

    border-radius: 5px;

    padding-bottom: 20px;
    border-bottom: 3px solid #00e0b6;
    cursor: pointer;

    background-color: whitesmoke;

    @media ${breakPoint.desktop} {
        width: calc(25% - 10px);
        flex-direction: column;
        margin-right: 10px;
        margin-top: 30px;
        align-items: center;
        border-radius: 5px;
        border-bottom: 5px solid #00e0b6;
    }
`;
const CardBox = styled.div`
    display: flex;
    flex-direction: column;

    @media ${breakPoint.desktop} {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const UserInfo = styled.div`
    width: calc(100% - 80px);
    padding-left: 10px;
    margin-top: 18px;
    margin-bottom: 5px;
    @media ${breakPoint.desktop} {
        width: 85%;
        order: 0;
        padding: 0;
    }
`;

const CourseName = styled.h4`
    width: 60vw;
    font-size: 20px;
    font-weight: 700;
    word-wrap: break-word;

    margin-bottom: 10px;
    @media ${breakPoint.desktop} {
        width: inherit;
        font-size: 24px;
        padding-top: 40px;
        height: 120px;
        word-wrap: break-word;
    }
`;

const UserSkillBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    color: #7f7f7f;
    font-size: 14px;
    margin-top: 5px;
    @media ${breakPoint.desktop} {
        width: 100%;
        justify-content: flex-start;
    }
`;

const UserPhoto = styled.img`
    display: block;
    width: 70px;
    height: 70px;
    border-radius: 100%;
    margin-top: 5px;
    margin-left: 5px;
    object-fit: cover;
    border: 3px solid whitesmoke;
    @media ${breakPoint.desktop} {
        display: block;
        position: absolute;
        width: 70px;
        height: 70px;
        border-radius: 100%;
        object-fit: cover;
        z-index: 2;

        top: -30px;
        left: 10px;
    }
`;

const SelfIntroduction = styled.p`
    word-break: break-all;
    overflow: hidden;
    max-height: 50px;
    height: 50px;
`;

const UserSkillName = styled.div`
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        padding-bottom: 10px;
    }
`;

export const TalentedPersonSearch = () => {
    const [searchField, setSearchField] = useState("");
    const [allUsers, setAllUsers] = useState();
    const [searchUsers, setSearchUsers] = useState();
    const [skills, setSkills] = useState();
    const [checkedSkills, setCheckedSkills] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        firebaseInit.getUsersInfoIncludeSkill().then(data => {
            console.log(data);
            setAllUsers(data);
        });
    }, []);

    useEffect(() => {
        firebaseInit
            .getCollection(collection(firebaseInit.db, "skills"))
            .then(data => {
                console.log(data);
                setSkills(data);
            });
    }, []);

    function searchUsersByKeyword(e) {
        e.preventDefault();
        if (!searchField.trim() && checkedSkills.length === 0)
            return window.alert("請輸入關鍵字或選擇技能");

        const filteredUserByKeyword = searchField.trim()
            ? allUsers.filter(data => {
                  return (
                      data.name
                          .toLowerCase()
                          .includes(searchField.toLowerCase().trim()) ||
                      data.selfIntroduction
                          .toLowerCase()
                          .includes(searchField.toLowerCase().trim()) ||
                      data.skills.some(skill =>
                          skill.title
                              .toLowerCase()
                              .includes(searchField.toLowerCase().trim()),
                      )
                  );
              })
            : [];

        const filteredUserBySkill = allUsers.filter(data =>
            data.skills.find(t => checkedSkills.includes(t.skillID)),
        );

        const allSearchOutcome = [
            ...filteredUserByKeyword,
            ...filteredUserBySkill,
        ];

        const filterRepeatSearchOutcome = allSearchOutcome.filter(
            (user, index, self) =>
                index === self.findIndex(t => t.uid === user.uid),
        );

        if (filterRepeatSearchOutcome.length === 0) {
            setSearchUsers([]);
            return window.alert("查無資料");
        }

        setSearchUsers(filterRepeatSearchOutcome);
    }

    const handleSkillChange = e => {
        const { value, checked } = e.target;

        if (checked) {
            setCheckedSkills(prev => [...prev, value]);
        }

        if (!checked) {
            setCheckedSkills(prev => prev.filter(e => e !== value));
        }
    };

    console.log(checkedSkills);

    return (
        <Container>
            {!skills ? (
                "loading..."
            ) : (
                <SearchArea>
                    <SearchInputBox>
                        <SearchInput
                            value={searchField}
                            changeValueCallback={e => {
                                setSearchField(e.target.value);
                            }}
                            searchCallback={e => searchUsersByKeyword(e)}
                            placeholderText="找找你/妳想要的人才..."
                        />
                    </SearchInputBox>
                    <SkillsBox>
                        <SkillFilter>技能篩選</SkillFilter>
                        {skills &&
                            skills.map(skill => (
                                <CheckSkills
                                    key={skill.skillID}
                                    skillID={skill.skillID}
                                    handleSkillChange={handleSkillChange}
                                    title={skill.title}
                                />
                            ))}
                    </SkillsBox>
                    <CardBox>
                        {searchUsers &&
                            searchUsers.map(user => (
                                <Card
                                    onClick={() => {
                                        navigate(
                                            `/personal-introduction?uid=${user.uid}`,
                                        );
                                    }}
                                >
                                    <UserPhoto
                                        src={user.photo}
                                        alt={user.name}
                                    ></UserPhoto>

                                    <UserInfo>
                                        <CourseName>{user.name}</CourseName>
                                        <SelfIntroduction>
                                            {user.selfIntroduction.length > 35
                                                ? `${user.selfIntroduction.substring(
                                                      0,
                                                      35,
                                                  )}...`
                                                : user.selfIntroduction}
                                        </SelfIntroduction>
                                    </UserInfo>
                                    <UserSkillBox>
                                        {user.skills.length === 0
                                            ? ""
                                            : user.skills.map(skill => (
                                                  <UserSkillName
                                                      key={skill.skillID}
                                                  >
                                                      #{skill.title}
                                                  </UserSkillName>
                                              ))}
                                    </UserSkillBox>
                                </Card>
                            ))}
                    </CardBox>
                </SearchArea>
            )}
        </Container>
    );
};
