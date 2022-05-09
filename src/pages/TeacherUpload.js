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
import { MyButton } from "../Component/MyButton";
import { useNavigate } from "react-router-dom";
import { AlertModal } from "../Component/AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";
import { LoadingForPost } from "../Component/LoadingForPost";

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
        align-items: flex-start;
        padding-left: 30px;
    }
`;

const FormArea = styled.form`
    width: 100%;
    background-color: whitesmoke;
    margin-top: 10px;
    padding: 10px;
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    @media ${breakPoint.desktop} {
        width: 70%;
        padding-left: 10px;
        display: flex;
        flex-wrap: wrap;
    }
`;

const Label = styled.label`
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    margin-top: 10px;
    flex-wrap: wrap;
    @media ${breakPoint.desktop} {
        flex-wrap: nowrap;
        justify-content: space-between;
    }
`;

const LabelForDate = styled(Label)`
    @media ${breakPoint.desktop} {
        width: 50%;
    }
`;

const LabeLForUpload = styled(Label)`
    flex-direction: column;
    width: fit-content;
    cursor: pointer;
`;

const SkillsDiv = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    margin-top: 10px;
    flex-wrap: wrap;

    @media ${breakPoint.desktop} {
        flex-wrap: nowrap;
        justify-content: space-between;
    }
`;

const Title = styled.div`
    height: 40px;
    line-height: 40px;
    @media ${breakPoint.desktop} {
        display: flex;
        align-items: center;
        padding-left: ${props => (props.paddingLeft ? "10px" : "none")};
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
        width: 80%;
    }
`;

const InputDate = styled(Input)`
    padding-right: 10px;
    @media ${breakPoint.desktop} {
        width: 60%;
    }
`;

const InputText = styled.textarea`
    width: 100%;
    height: 60px;
    padding-left: 10px;
    padding-top: 5px;
    border-radius: 5px;

    border: 1px solid #ff6100;
    &:focus {
        outline: none;
    }
    @media ${breakPoint.desktop} {
        width: 80%;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const Button = styled.div`
    width: 100%;
    margin: 20px 0;

    @media ${breakPoint.desktop} {
        margin: auto;
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
    }
`;
const PreviewImg = styled.div`
    width: 200px;
    height: 130px;
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: 10px;
    background-color: white;
    background-image: url(${props => props.img});
    border: 1px solid #ff6100;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SkillsBox = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    @media ${breakPoint.desktop} {
        width: 80%;
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
    const [courseID, setCourseID] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

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
                        setIsLoading(true);
                        break;
                    default:
                        console.log("default");
                }
            },
            error => {
                setIsLoading(false);
                console.log(error);
                handleAlertModal("發生錯誤，請再試一次");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    dispatch({
                        type: "setImageURL",
                        payload: { image: downloadURL },
                    });
                    setIsLoading(false);
                    setImage(downloadURL);
                });
            },
        );
    };

    const uploadCourse = async e => {
        e.preventDefault();
        const positiveInteger = /^[0-9]*[1-9][0-9]*$/;
        if (!positiveInteger.test(state.minOpeningNumber))
            return handleAlertModal("開班人數至少1人且為整數");
        if (
            new Date(state.openingDate) < new Date() ||
            new Date(state.registrationDeadline) < new Date()
        )
            return handleAlertModal("選擇日期不得晚於今日");

        if (new Date(state.openingDate) < new Date(state.registrationDeadline))
            return handleAlertModal("開課日不得早於報名截止日");

        if (
            Object.values(state).some(value => !value) ||
            state.getSkills.length === 0
        )
            return handleAlertModal("請輸入完整資料");

        setIsLoading(true);

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
                setIsLoading(false);
                handleAlertModal("上架成功，來看看課程資訊吧！");
            });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            return handleAlertModal("發送錯誤，請再試一次");
        }
        setCourseID(docRef.id);
    };
    console.log(state.getSkills);

    return (
        <>
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
                                    payload: {
                                        courseIntroduction: e.target.value,
                                    },
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
                                    payload: {
                                        minOpeningNumber: e.target.value,
                                    },
                                })
                            }
                        />
                    </LabelForDate>
                    <LabelForDate>
                        <Title paddingLeft={true}>開班日期</Title>
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
                    <LabeLForUpload>
                        <div>
                            <FiUpload />

                            <span>上傳封面照 </span>
                        </div>

                        <FileInput
                            type="file"
                            accept="image/*"
                            onChange={e => uploadImage(e)}
                        />

                        <PreviewImg img={image}>
                            {image ? "" : "預覽區"}
                        </PreviewImg>
                    </LabeLForUpload>
                    <Button>
                        <MyButton
                            clickFunction={uploadCourse}
                            buttonWord={"上架課程"}
                        ></MyButton>
                    </Button>
                </FormArea>
            </Container>
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
                courseID={courseID}
            />
            {isLoading ? <LoadingForPost /> : ""}
        </>
    );
};
