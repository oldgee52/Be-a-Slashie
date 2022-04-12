import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import db from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;

const FormArea = styled.form`
    width: 100%;
    margin-top: 16px;
`;

const Label = styled.label`
    display: flex;
    width: 100%;
    margin-bottom: 16px;

    @media (max-width: 992px) {
        flex-wrap: wrap;
    }
`;

const FormDiv = styled.div`
    width: 104px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
`;

const Input = styled.input`
    width: 100%;
    height: 40px;
`;

const Button = styled.button`
    width: 100%;
    height: 48px;
    text-align: center;

    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    background-color: #f44336;
    border: none;
    cursor: pointer;
`;

const initState = {
    title: "",
    courseIntroduction: "",
    teacherIntroduction: "",
    getSkills: [],
    image: "",
    minOpeningNumber: 1,
    openingDate: "",
    registrationDeadline: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "setTitle":
            return {
                ...state,
                title: action.payload.title,
            };
        case "setCourseIntroduction":
            return {
                ...state,
                courseIntroduction: action.payload.courseIntroduction,
            };
        case "setTeacherIntroduction":
            return {
                ...state,
                teacherIntroduction: action.payload.teacherIntroduction,
            };
        case "setMinOpeningNumber":
            return {
                ...state,
                minOpeningNumber: action.payload.minOpeningNumber,
            };
        case "setOpeningDate":
            return {
                ...state,
                openingDate: action.payload.openingDate,
            };
        case "setRegistrationDeadline":
            return {
                ...state,
                registrationDeadline: action.payload.registrationDeadline,
            };
        case "setGetSkills":
            return {
                ...state,
                getSkills: action.payload.getSkills,
            };
        case "removeGetSkills":
            return {
                ...state,
                getSkills: action.payload.getSkills,
            };

        default:
            return state;
    }
}

export const TeacherUpload = () => {
    const [state, dispatch] = useReducer(reducer, initState);
    const [allSkills, setAllSkills] = useState();

    const handleSkillChange = e => {
        const { value, checked } = e.target;

        if (checked) {
            dispatch({
                type: "setGetSkills",
                payload: { getSkills: [...state.getSkills, value] },
            });
        }
        if (!checked) {
            dispatch({
                type: "removeGetSkills",
                payload: {
                    getSkills: state.getSkills.filter(e => e !== value),
                },
            });
        }
    };

    useEffect(() => {
        (async function (db) {
            const skillsCol = collection(db, "skills");
            const skillsSnapshot = await getDocs(skillsCol);
            const skillList = skillsSnapshot.docs.map(doc => doc.data());
            console.log(skillList);
            setAllSkills(skillList);
        })(db);
    }, []);

    const sendMessage = e => {
        e.preventDefault();
        console.log(state);
    };

    return (
        <Container>
            <FormArea>
                <Label>
                    <FormDiv>課程名稱</FormDiv>
                    <Input
                        type="text"
                        value={state.title}
                        onChange={e =>
                            dispatch({
                                type: "setTitle",
                                payload: { title: e.target.value },
                            })
                        }
                    />
                </Label>
                <Label>
                    <FormDiv>課程簡介</FormDiv>
                    <Input
                        type="text"
                        value={state.courseIntroduction}
                        onChange={e =>
                            dispatch({
                                type: "setCourseIntroduction",
                                payload: { courseIntroduction: e.target.value },
                            })
                        }
                    />
                </Label>
                <Label>
                    <FormDiv>老師簡介</FormDiv>
                    <Input
                        type="text"
                        value={state.teacherIntroduction}
                        onChange={e =>
                            dispatch({
                                type: "setTeacherIntroduction",
                                payload: {
                                    teacherIntroduction: e.target.value,
                                },
                            })
                        }
                    />
                </Label>
                <Label>
                    <FormDiv>開班人數</FormDiv>
                    <Input
                        type="number"
                        min={1}
                        value={state.minOpeningNumber}
                        onChange={e =>
                            dispatch({
                                type: "setMinOpeningNumber",
                                payload: { minOpeningNumber: e.target.value },
                            })
                        }
                    />
                </Label>
                <Label>
                    <FormDiv>開班日期</FormDiv>
                    <Input
                        type="date"
                        value={state.openingDate}
                        onChange={e =>
                            dispatch({
                                type: "setOpeningDate",
                                payload: { openingDate: e.target.value },
                            })
                        }
                    />
                </Label>
                <Label>
                    <FormDiv>報名截止日</FormDiv>
                    <Input
                        type="date"
                        value={state.registrationDeadline}
                        onChange={e =>
                            dispatch({
                                type: "setRegistrationDeadline",
                                payload: {
                                    registrationDeadline: e.target.value,
                                },
                            })
                        }
                    />
                </Label>
                <FormDiv>可得技能</FormDiv>
                <>
                    {allSkills &&
                        allSkills.map(skill => (
                            <p key={skill.skillID}>
                                <input
                                    type="checkbox"
                                    id={skill.skillID}
                                    value={skill.skillID}
                                    key={skill.skillID}
                                    name="skills"
                                    onChange={handleSkillChange}
                                />
                                <label htmlFor={skill.skillID}>
                                    {skill.title}
                                </label>
                            </p>
                        ))}
                </>

                <Button onClick={sendMessage}>Send Message</Button>
            </FormArea>
        </Container>
    );
};
