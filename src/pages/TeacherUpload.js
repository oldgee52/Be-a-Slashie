import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import firebaseInit from "../utils/firebase";
import {
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

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
        case "setImageURL":
            return {
                ...state,
                image: action.payload.image,
            };
        case "clear":
            return initState;

        default:
            return state;
    }
}

export const TeacherUpload = () => {
    const [state, dispatch] = useReducer(reducer, initState);
    const [allSkills, setAllSkills] = useState();
    const [image, setImage] = useState();

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
        })(firebaseInit.db);
    }, []);

    const uploadImage = e => {
        e.preventDefault();
        console.log(e.target.value);
        const mountainImagesRef = ref(
            firebaseInit.storage,
            `image-${image.value}`,
        );
        const uploadTask = uploadBytesResumable(
            mountainImagesRef,
            image.files[0],
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
                });
            },
        );
    };

    const sendMessage = async e => {
        e.preventDefault();
        if (Object.values(state).some(value => !value))
            return window.alert("請輸入完整資料");
        const coursesRef = collection(firebaseInit.db, "courses");
        const docRef = doc(coursesRef);
        const coursesInfo = {
            ...state,
            openingDate: new Date(state.openingDate),
            registrationDeadline: new Date(state.registrationDeadline),
            creatTime: new Date(),
            courseID: docRef.id,
            view: 0,
            teacherUserID: "QptFGccbXGVyiTwmvxFG07JNbjp1",
            status: "registration",
        };
        try {
            await Promise.all([
                setDoc(docRef, coursesInfo),
                addDoc(
                    collection(
                        firebaseInit.db,
                        "courses",
                        docRef.id,
                        "teacher",
                    ),
                    {
                        teacherUserID: "QptFGccbXGVyiTwmvxFG07JNbjp1",
                        courseID: docRef.id,
                    },
                ),
                updateDoc(
                    doc(
                        firebaseInit.db,
                        "users",
                        "QptFGccbXGVyiTwmvxFG07JNbjp1",
                    ),
                    {
                        teachersCourses: arrayUnion(docRef.id),
                    },
                ),
            ]);
            return window.alert("上架成功");
        } catch (error) {
            console.log(error);
            window.alert("發生錯誤，請重新試一次");
        }
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
                <Label>
                    <FormDiv>上傳封面照</FormDiv>

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={e => setImage(e.target)}
                    />
                    <button onClick={uploadImage}>上傳</button>
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
