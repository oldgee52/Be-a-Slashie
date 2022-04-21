import { collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PaginatedItems from "../Component/Paginate";
import firebaseInit from "../utils/firebase";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;
const SearchArea = styled.div`
    width: 100%;
`;

const InputArea = styled.input`
    width: 100%;
`;

const Button = styled.button`
    width: 100%;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

const Div12 = styled(Div1)`
    border: 1px solid black;
`;

const DivContent = styled.div`
    padding-right: 20px;
    width: 100%;
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

    function searchUsersByKeyword() {
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
                    <InputArea
                        type="search"
                        placeholder="Search"
                        value={searchField}
                        onChange={e => {
                            setSearchField(e.target.value);
                        }}
                    />
                    {skills &&
                        skills.map(skill => (
                            <div key={skill.skillID}>
                                <input
                                    type="checkbox"
                                    value={skill.skillID}
                                    key={skill.skillID}
                                    id={skill.skillID}
                                    name="skills"
                                    onClick={handleSkillChange}
                                />
                                <label htmlFor={skill.skillID}>
                                    {skill.title}
                                </label>
                            </div>
                        ))}
                    <Button onClick={searchUsersByKeyword}>送出</Button>
                    {/* {searchCourses && (
                    <PaginatedItems itemsPerPage={1} searchData={searchCourses} />
                )} */}
                    {searchUsers &&
                        searchUsers.map(user => (
                            <Div12
                                key={user.uid}
                                onClick={() => {
                                    navigate(
                                        `/personal-introduction?uid=${user.uid}`,
                                    );
                                }}
                            >
                                <DivContent>姓名:{user.name}</DivContent>
                                <DivContent>
                                    介紹:{user.selfIntroduction}
                                </DivContent>
                                <DivContent>
                                    技能:
                                    {user.skills.length === 0 ? (
                                        <div>尚未取得技能</div>
                                    ) : (
                                        user.skills.map(skill => (
                                            <div key={skill.skillID}>
                                                {skill.title}{" "}
                                            </div>
                                        ))
                                    )}{" "}
                                </DivContent>
                            </Div12>
                        ))}
                </SearchArea>
            )}
        </Container>
    );
};
