import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import { breakPoint } from "../utils/breakPoint";
import CheckSkills from "../Component/skills/CheckSkills";
import { Loading } from "../Component/loading/Loading";
import NoDataTitle from "../Component/common/NoDataTitle";
import { Footer } from "../Component/Footer";
import SearchInput from "../Component/search/SearchInput";
import { findUniqueOutcomeWithUid } from "../utils/functions";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;
    align-content: flex-start;

    padding: 80px 10px;
    min-height: calc(100vh - 100px);

    @media ${breakPoint.desktop} {
        justify-content: flex-start;
        max-width: 1200px;
        min-height: calc(100vh - 55px);
    }
`;

const SearchInputBox = styled.div`
    width: 100%;

    @media ${breakPoint.desktop} {
        width: 31%;
        padding-left: 15px;
    }
`;

const SkillsBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    margin: 10px 0 10px 10px;

    @media ${breakPoint.desktop} {
        margin-bottom: 0;
        padding-left: 10px;
    }
`;

const SkillFilter = styled.div`
    color: #7f7f7f;
    font-weight: 600;
    letter-spacing: 1px;
    width: 100%;
    padding-left: ${props => (props.paddingLeft ? props.paddingLeft : "0")};
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
    border-bottom: 3px solid #00bea4;
    cursor: pointer;

    background-color: whitesmoke;

    @media ${breakPoint.desktop} {
        width: calc(25% - 10px);
        flex-direction: column;
        margin-right: 10px;
        margin-top: 30px;
        align-items: center;
        border-radius: 5px;
        border-bottom: 5px solid #00bea4;
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
        height: 80px;
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

const TalentedPersonSearch = () => {
    const [searchField, setSearchField] = useState("");
    const [allUsers, setAllUsers] = useState();
    const [searchUsers, setSearchUsers] = useState([]);
    const [skills, setSkills] = useState();
    const [checkedSkills, setCheckedSkills] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        firebaseInit.getUsersInfoIncludeSkill().then(data => {
            setSearchUsers(data);
            setAllUsers(data);
        });
    }, []);

    useEffect(() => {
        firebaseInit.getSkillsInfo().then(data => setSkills(data));
    }, []);

    function filterOutcome(searchValue, checkedSkillsArray) {
        const filteredUserByKeyword = searchValue.trim()
            ? allUsers.filter(user => {
                  return (
                      user.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase().trim()) ||
                      user.selfIntroduction
                          .toLowerCase()
                          .includes(searchValue.toLowerCase().trim())
                  );
              })
            : [];
        const filteredUserBySkill = allUsers.filter(user => {
            if (
                checkedSkillsArray.every(skillID =>
                    user.skills.map(e => e.skillID).includes(skillID),
                )
            )
                return user;

            return null;
        });

        const allSearchOutcome = [
            ...filteredUserByKeyword,
            ...filteredUserBySkill,
        ];

        return { allSearchOutcome, filteredUserByKeyword, filteredUserBySkill };
    }

    function searchUsersByKeyword(e) {
        if (!e.target.value.trim() && checkedSkills.length === 0)
            return setSearchUsers(allUsers);
        const outcome = filterOutcome(e.target.value, checkedSkills);

        const filterRepeatSearchOutcome =
            checkedSkills.length === 0
                ? outcome.filteredUserByKeyword
                : outcome.filteredUserByKeyword.length !== 0 &&
                  outcome.filteredUserBySkill.length !== 0
                ? findUniqueOutcomeWithUid(outcome.allSearchOutcome)
                : outcome.filteredUserBySkill.length === 0 &&
                  outcome.filteredUserByKeyword.length !== 0
                ? outcome.filteredUserByKeyword
                : outcome.filteredUserBySkill.length !== 0 &&
                  !e.target.value.trim()
                ? outcome.filteredUserBySkill
                : [];

        setSearchUsers(filterRepeatSearchOutcome);
    }

    const handleSkillChange = e => {
        const { value, checked } = e.target;

        if (checked) {
            const NewCheckedSkills = [...checkedSkills, value];
            setCheckedSkills(NewCheckedSkills);
            const outcome = filterOutcome(searchField, NewCheckedSkills);
            const filterRepeatSearchOutcome =
                outcome.filteredUserByKeyword.length === 0
                    ? outcome.filteredUserBySkill
                    : findUniqueOutcomeWithUid(outcome.allSearchOutcome);

            setSearchUsers(filterRepeatSearchOutcome);
        }

        if (!checked) {
            const NewCheckedSkills = checkedSkills.filter(e => e !== value);
            setCheckedSkills(NewCheckedSkills);
            if (!searchField.trim() && NewCheckedSkills.length === 0)
                return setSearchUsers(allUsers);
            const outcome = filterOutcome(searchField, NewCheckedSkills);

            const filterRepeatSearchOutcome =
                NewCheckedSkills.length === 0
                    ? outcome.filteredUserByKeyword
                    : outcome.filteredUserByKeyword.length === 0
                    ? outcome.filteredUserBySkill
                    : findUniqueOutcomeWithUid(outcome.allSearchOutcome);

            setSearchUsers(filterRepeatSearchOutcome);
        }
    };

    return (
        <>
            {!skills || !allUsers || !searchUsers ? (
                <Loading />
            ) : (
                <>
                    <Container>
                        <SearchArea>
                            <SearchInputBox>
                                <SearchInput
                                    searchField={searchField}
                                    setSearchField={setSearchField}
                                    changeValueCallback={e => {
                                        setSearchField(e.target.value);
                                        searchUsersByKeyword(e);
                                    }}
                                    searchCallback={e => e.preventDefault()}
                                    placeholderText="輸入姓名或勾選下方技能找人才..."
                                />
                            </SearchInputBox>
                            <SkillsBox>
                                <SkillFilter>技能篩選</SkillFilter>
                                {skills &&
                                    skills.map(skill => (
                                        <CheckSkills
                                            key={skill.skillID}
                                            skillID={skill.skillID}
                                            handleSkillChange={
                                                handleSkillChange
                                            }
                                            title={skill.title}
                                        />
                                    ))}
                            </SkillsBox>
                            <CardBox>
                                {searchUsers.length === 0 ? (
                                    <SkillFilter paddingLeft="18px">
                                        <NoDataTitle title="無符合結果" />
                                    </SkillFilter>
                                ) : (
                                    searchUsers.map(user => (
                                        <Card
                                            onClick={() => {
                                                navigate(
                                                    `/personal-introduction?uid=${user.uid}`,
                                                );
                                            }}
                                            key={user.uid}
                                        >
                                            <UserPhoto
                                                src={user.photo}
                                                alt={user.name}
                                            ></UserPhoto>

                                            <UserInfo>
                                                <CourseName>
                                                    {user.name}
                                                </CourseName>
                                                <SelfIntroduction>
                                                    {user.selfIntroduction
                                                        .length > 35
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
                                                              key={
                                                                  skill.skillID
                                                              }
                                                          >
                                                              #{skill.title}
                                                          </UserSkillName>
                                                      ))}
                                            </UserSkillBox>
                                        </Card>
                                    ))
                                )}
                            </CardBox>
                        </SearchArea>
                    </Container>
                    <Footer />
                </>
            )}
        </>
    );
};

export default TalentedPersonSearch;
