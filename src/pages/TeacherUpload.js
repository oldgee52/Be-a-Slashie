import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { breakPoint } from "../utils/breakPoint";
import { FiUpload } from "react-icons/fi";
import { CheckSkills } from "../Component/CheckSkills";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    @media ${breakPoint.desktop} {
        width: 80%;
        margin: auto;
        margin-top: -150px;
    }
`;

const FormArea = styled.form`
    width: 90%;
    @media ${breakPoint.desktop} {
        display: flex;
        flex-wrap: wrap;
    }

    /* margin-top: 10px; */
`;

const Label = styled.label`
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    margin-top: 10px;
    flex-wrap: wrap;

    @media ${breakPoint.desktop} {
        flex-wrap: nowrap;
    }
`;

const LabelForDate = styled(Label)`
    @media ${breakPoint.desktop} {
        flex-wrap: nowrap;
        width: 45%;
    }
`;

const SkillsDiv = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    margin-top: 10px;
    flex-wrap: wrap;

    @media ${breakPoint.desktop} {
        flex-wrap: nowrap;
    }
`;

const Title = styled.div`
    height: 40px;
    line-height: 40px;
    @media ${breakPoint.desktop} {
        display: flex;
        align-items: center;
        width: 100px;
    }
`;

const TextAreaTitle = styled(Title)`
    @media ${breakPoint.desktop} {
        height: 60px;
        line-height: 60px;
    }
`;

const Input = styled.input`
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid #ff6100;

    &:focus {
        outline: none;
    }

    @media ${breakPoint.desktop} {
        width: 70%;
        height: 40px;
    }
`;

const InputDate = styled(Input)`
    @media ${breakPoint.desktop} {
        width: 55%;
    }
`;

const InputText = styled.textarea`
    width: 100%;
    height: 60px;
    padding-left: 10px;
    border-radius: 5px;

    border: 1px solid #ff6100;
    &:focus {
        outline: none;
    }
    @media ${breakPoint.desktop} {
        width: 70%;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const Button = styled.button`
    width: 100%;
    height: 48px;
    text-align: center;

    color: #ffffff;
    font-size: 14px;
    background: linear-gradient(to left, #ff8f08 -10.47%, #ff6700 65.84%);
    border-radius: 5px;
    cursor: pointer;

    margin: 20px 0;

    @media ${breakPoint.desktop} {
        width: 200px;
        margin: auto;
        margin-top: 10px;
        margin-bottom: 10px;
    }
`;
const PreviewImg = styled.img`
    width: 200px;
    height: 130px;
    object-fit: contain;
    margin-left: 20px;
`;

const SkillsBox = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    @media ${breakPoint.desktop} {
        margin-bottom: 0;
    }
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
        case "setImageURL":
            return {
                ...state,
                image: action.payload.image,
            };
        default:
            return state;
    }
}

export const TeacherUpload = ({ userID }) => {
    const [state, dispatch] = useReducer(reducer, initState);
    const [allSkills, setAllSkills] = useState();
    const [image, setImage] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        (async function (db) {
            const skillsCol = collection(db, "skills");
            const skillsSnapshot = await getDocs(skillsCol);
            const skillList = skillsSnapshot.docs.map(doc => doc.data());
            console.log(skillList);
            setAllSkills(skillList);
        })(firebaseInit.db);
    }, []);

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

    const uploadImage = e => {
        e.preventDefault();
        if (!e.target.value) return;
        console.log(e.target.value);
        const mountainImagesRef = ref(
            firebaseInit.storage,
            `image-${e.target.value}`,
        );
        const uploadTask = uploadBytesResumable(
            mountainImagesRef,
            e.target.files[0],
        );
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        console.log("default");
                }
            },
            error => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    dispatch({
                        type: "setImageURL",
                        payload: { image: downloadURL },
                    });
                    setImage(downloadURL);
                });
            },
        );
    };

    const uploadCourse = async e => {
        e.preventDefault();
        if (
            new Date(state.openingDate) < new Date() ||
            new Date(state.registrationDeadline) < new Date()
        )
            return window.alert("日期不得晚於今日");
        if (new Date(state.openingDate) < new Date(state.registrationDeadline))
            return window.alert("開課日不得早於報名截止日");
        if (
            Object.values(state).some(value => !value) ||
            state.getSkills.length === 0
        )
            return window.alert("請輸入完整資料");

        const coursesRef = collection(firebaseInit.db, "courses");
        const docRef = doc(coursesRef);
        const coursesInfo = {
            ...state,
            openingDate: new Date(`${state.openingDate} 23:59:59`),
            registrationDeadline: new Date(
                `${state.registrationDeadline} 23:59:59`,
            ),
            creatTime: new Date(),
            courseID: docRef.id,
            view: 0,
            teacherUserID: userID,
            status: 0,
            askedQuestions: [],
            registrationNumber: 0,
        };
        try {
            await Promise.all([
                setDoc(docRef, coursesInfo),
                setDoc(
                    doc(
                        firebaseInit.db,
                        "courses",
                        docRef.id,
                        "teacher",
                        "info",
                    ),
                    {
                        teacherUserID: userID,
                        courseID: docRef.id,
                    },
                ),
                updateDoc(doc(firebaseInit.db, "users", userID), {
                    teachersCourses: arrayUnion(docRef.id),
                }),
            ]).then(() => {
                window.alert("上架成功，來去看看上架課程吧！");
                navigate(`/course?courseID=${docRef.id}`);
            });
        } catch (error) {
            console.log(error);
            window.alert("發生錯誤，請重新試一次");
        }
    };

    return (
        <Container>
            <FormArea>
                <Label>
                    <Title>課程名稱</Title>
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
                    <TextAreaTitle>課程簡介</TextAreaTitle>
                    <InputText
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
                    <TextAreaTitle>老師簡介</TextAreaTitle>
                    <InputText
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
                <LabelForDate>
                    <Title>開班人數</Title>
                    <InputDate
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
                </LabelForDate>
                <LabelForDate>
                    <Title>開班日期</Title>
                    <InputDate
                        type="date"
                        value={state.openingDate}
                        onChange={e =>
                            dispatch({
                                type: "setOpeningDate",
                                payload: { openingDate: e.target.value },
                            })
                        }
                    />
                </LabelForDate>

                <LabelForDate>
                    <Title>報名截止日</Title>
                    <InputDate
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
                </LabelForDate>
                <SkillsDiv>
                    <Title>可得技能</Title>
                    <SkillsBox>
                        {allSkills &&
                            allSkills.map(skill => (
                                <CheckSkills
                                    key={skill.skillID}
                                    skillID={skill.skillID}
                                    handleSkillChange={handleSkillChange}
                                    title={skill.title}
                                />
                            ))}
                    </SkillsBox>
                </SkillsDiv>
                <Label>
                    <FiUpload />

                    <span>上傳封面照 </span>

                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={e => uploadImage(e)}
                    />
                    {image && <PreviewImg src={image} alt="上傳圖片" />}
                </Label>

                <Button onClick={uploadCourse}>上架課程</Button>
            </FormArea>
        </Container>
    );
};
