import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiUpload } from "react-icons/fi";
import firebaseInit from "../utils/firebase";
import breakPoint from "../utils/breakPoint";
import CheckSkills from "../Component/skills/CheckSkills";
import MyButton from "../Component/common/MyButton";
import AlertModal from "../Component/common/AlertModal";
import useAlertModal from "../customHooks/useAlertModal";
import LoadingForPost from "../Component/loading/LoadingForPost";
import useFirebaseUploadFile from "../customHooks/useFirebaseUploadFile";

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
    border: 1px solid #7f7f7f;

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

    border: 1px solid #7f7f7f;
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
    border: 1px solid #7f7f7f;
    border-radius: 5px;
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
const DirectionBox = styled.div`
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 5px;
`;
const DirectionTitle = styled.div`
    font-weight: 600;
    font-size: 16px;
    margin: 5px 0 5px 0;
`;

const List = styled.li`
    &::before {
        content: "${"\0"}040";
        color: #ff6700;
        top: -1px;
        margin-right: 5px;
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
        case "setImage":
            return {
                ...state,
                image: action.payload.image,
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

function TeacherUpload({ userID }) {
    const [state, dispatch] = useReducer(reducer, initState);
    const [allSkills, setAllSkills] = useState();
    const [image, setImage] = useState();
    const [courseID, setCourseID] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const [uploadIsLoading, uploadFile] = useFirebaseUploadFile();

    useEffect(() => {
        firebaseInit.getSkillsInfo().then(data => setAllSkills(data));
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
                    getSkills: state.getSkills.filter(event => event !== value),
                },
            });
        }
    };

    const uploadImage = async (fileName, file) => {
        if (!fileName || !file) return;
        const fileURL = await uploadFile(fileName, file);
        dispatch({
            type: "setImage",
            payload: { image: fileURL },
        });
        setImage(fileURL);
        handleAlertModal("上傳成功");
    };

    const uploadCourse = async e => {
        e.preventDefault();
        const positiveInteger = /^[0-9]*[1-9][0-9]*$/;
        if (!positiveInteger.test(state.minOpeningNumber))
            return handleAlertModal("開班人數至少1人且為整數");

        if (new Date(state.openingDate) < new Date(state.registrationDeadline))
            return handleAlertModal("開課日不得早於報名截止日");

        setIsLoading(true);

        try {
            const newCourseID = await firebaseInit.setDocForNewCourse(
                state,
                userID,
            );
            await firebaseInit.setDocForCourseAddTeacherInfo(
                newCourseID,
                userID,
            );
            await firebaseInit.updateDocForUserTeachersCourses(
                newCourseID,
                userID,
            );
            setCourseID(newCourseID);
            setIsLoading(false);
            handleAlertModal("上架成功，來看看課程資訊吧！");
        } catch (error) {
            setIsLoading(false);
            handleAlertModal(`發送錯誤，請再試一次-錯誤內容；${error}`);
        }
        return null;
    };

    return (
        <>
            <Container>
                <FormArea>
                    <DirectionBox>
                        <DirectionTitle>課程上架說明</DirectionTitle>
                        <ul>
                            <List>
                                本網站僅提供課程上架與媒合，實際上課方式、價錢等，請自行與學生確認並負相關責任
                            </List>
                            <List>
                                上架完成後，若有學生報名將會收到mail通知，開課前請確認同意上課的學生
                            </List>
                            <List>
                                進行中課程，提供教材上傳及作業設定，可查看學生上傳作業資訊，課程結束前請確認是否給技能徽章
                            </List>
                            <List>
                                若發現無適合可得技能，請
                                <a href="mailto:beaslashie@gmail.com">Mail</a>
                                與我們聯繫
                            </List>
                        </ul>
                    </DirectionBox>
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
                        <Title paddingLeft>開班日期</Title>
                        <InputDate
                            type="date"
                            value={state.openingDate}
                            min={new Date().toLocaleDateString("en-ca")}
                            onChange={e => {
                                dispatch({
                                    type: "setOpeningDate",
                                    payload: { openingDate: e.target.value },
                                });
                            }}
                        />
                    </LabelForDate>

                    <LabelForDate>
                        <Title>報名截止日</Title>
                        <InputDate
                            type="date"
                            value={state.registrationDeadline}
                            min={new Date().toLocaleDateString("en-ca")}
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
                            onChange={e =>
                                uploadImage(e.target.value, e.target.files[0])
                            }
                        />

                        <PreviewImg img={image}>
                            {image ? "" : "預覽區"}
                        </PreviewImg>
                    </LabeLForUpload>
                    <Button>
                        <MyButton
                            clickFunction={uploadCourse}
                            buttonWord="上架課程"
                        />
                    </Button>
                </FormArea>
            </Container>
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
                courseID={courseID}
            />
            {(isLoading || uploadIsLoading) && <LoadingForPost />}
        </>
    );
}
TeacherUpload.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default TeacherUpload;
