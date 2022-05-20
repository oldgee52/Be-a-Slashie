import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import { updateDoc, doc, arrayUnion, Timestamp } from "firebase/firestore";
import { breakPoint } from "../utils/breakPoint";
import { NoDataTitle } from "../Component/NoDataTitle";
import { MyButton } from "../Component/MyButton";
import { FiUpload } from "react-icons/fi";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { useAlertModal } from "../customHooks/useAlertModal";
import { AlertModal } from "../Component/AlertModal";
import { Loading } from "../Component/Loading";
import { LoadingForPost } from "../Component/LoadingForPost";
import { useCustomDateDisplay } from "../customHooks/useCustomDateDisplay";
import { NoDataBox } from "../Component/NoDataBox";
import { useHandleValueChangeForArray } from "../customHooks/useHandleValueChangeForArray";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;

    @media ${breakPoint.desktop} {
        width: 80%;
        margin: auto;
        margin-top: -150px;
    }
`;

const CourseCard = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: whitesmoke;
    margin-bottom: 10px;

    border-radius: 5px;
    max-height: ${props => (props.show ? "1000px" : "70px")};
    overflow: hidden;
    transition: ${props =>
        props.show ? "max-height 1s ease-out" : "max-height 0.3s ease-in"};
    @media ${breakPoint.desktop} {
        max-height: ${props => (props.show ? "1000px" : "75px")};
    }
`;

const CourseTitle = styled.h3`
    font-size: 18px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    line-height: 1.2;

    margin-bottom: 10px;

    word-break: break-all;
    cursor: pointer;

    @media ${breakPoint.desktop} {
        font-size: 22px;
    }
`;

const Name = styled.div`
    margin-top: 5px;
    font-weight: 500;
    padding-left: 25px;
    font-size: 16px;

    @media ${breakPoint.desktop} {
        width: 40%;

        padding-left: 30px;
    }
`;

const Title = styled.h3`
    font-size: 16px;

    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const StudentUploadHomework = styled.div`
    display: flex;
    margin-bottom: 10px;
    flex-direction: column;
    width: 100%;
    padding: 0 10px;
    @media ${breakPoint.desktop} {
    }
`;
const UploadHomework = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;

const HomeworkTitle = styled.div`
    width: 100%;
    word-break: break-all;
    margin-bottom: 5px;

    @media ${breakPoint.desktop} {
        width: 80%;
    }
`;
const HomeworkDate = styled.div`
    width: 70%;
    @media ${breakPoint.desktop} {
        width: 10%;
    }
`;
const HomeworkDownload = styled.div`
    width: 30%;
    text-align: right;
    color: #ff6100;
    @media ${breakPoint.desktop} {
        width: 10%;
    }
`;

const NotUploadHomework = styled(UploadHomework)`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const NotUploadHomeworkTitle = styled(HomeworkTitle)`
    width: 50%;
`;

const ButtonArea = styled.div`
    width: 100%;
    margin-top: 10px;

    @media ${breakPoint.desktop} {
        width: 130px;
        margin-top: 0px;
    }
`;

const FileLabel = styled.label`
    width: 50%;
    text-align: right;
    @media ${breakPoint.desktop} {
        flex: 1 0 calc(50% - 150px);
        margin-right: 10px;
        line-height: 40px;
    }
`;
const FileInput = styled.input`
    display: none;
`;

const AllHomeworkArea = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
`;
const SubTitle = styled(Title)`
    border-bottom: none;
    margin-left: 10px;
    margin-top: 10px;
    width: 100%;
    padding-bottom: 0;
`;

export const StudentOpeningCourse = ({ userID }) => {
    const [courseDetails, setCourseDetails] = useState();
    const [inputFields, SetInputFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const customDateDisplay = useCustomDateDisplay();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
    const handleChange = useHandleValueChangeForArray();
    useEffect(() => {
        let isMounted = true;
        if (userID) {
            firebaseInit
                .getStudentOpeningCourseDetails(userID, 1)
                .then(data => {
                    if (isMounted) {
                        const newCoursesArray = data.map(course => ({
                            ...course,
                            isShow: false,
                        }));
                        setCourseDetails(newCoursesArray);
                        SetInputFields(
                            data.map(item =>
                                Array(item.allHomework?.length || 0)
                                    .fill()
                                    .map(() => ({ file: "" })),
                            ),
                        );
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [userID]);

    function getUploadedHomework(array1, array2) {
        return array1?.filter(object1 => {
            return array2.some(object2 => {
                return object1.title === object2.title;
            });
        });
    }

    function getNotUploadedHomework(array1, array2) {
        return array1.filter(object1 => {
            return !array2.some(object2 => {
                return object1.title === object2.title;
            });
        });
    }

    const renderUploadedHomework = index => {
        const allHomework = courseDetails.map(detail => detail.allHomework);
        const myHomework = courseDetails.map(detail => detail.myHomework);
        const uploadedHomework = getUploadedHomework(
            myHomework[index],
            allHomework[index],
        );

        return (
            <StudentUploadHomework>
                {uploadedHomework.length === 0 ? (
                    <NoDataTitle title="無" />
                ) : (
                    uploadedHomework.map(homework => (
                        <UploadHomework key={homework.fileURL}>
                            <HomeworkTitle>{homework.title} </HomeworkTitle>
                            <HomeworkDate>
                                {customDateDisplay(
                                    homework.uploadDate.seconds * 1000,
                                )}
                            </HomeworkDate>
                            <HomeworkDownload>
                                <a
                                    href={homework.fileURL}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    下載
                                </a>
                            </HomeworkDownload>
                        </UploadHomework>
                    ))
                )}
            </StudentUploadHomework>
        );
    };

    const renderNotUploadedHomework = index => {
        const allHomework = courseDetails.map(detail => detail.allHomework);
        const myHomework = courseDetails.map(detail => detail.myHomework);
        const notUploadedHomework = getNotUploadedHomework(
            allHomework[index],
            myHomework[index],
        );

        return (
            <StudentUploadHomework>
                {notUploadedHomework.length === 0 ? (
                    <NoDataTitle title="無" />
                ) : (
                    notUploadedHomework.map((homework, i) => (
                        <NotUploadHomework key={homework.creatDate.seconds}>
                            <NotUploadHomeworkTitle>
                                {homework.title}
                            </NotUploadHomeworkTitle>
                            <FileLabel
                                htmlFor={`${homework.creatDate.seconds}`}
                            >
                                <FileInput
                                    type="file"
                                    id={`${homework.creatDate.seconds}`}
                                    onChange={e => {
                                        const changeData = {
                                            data: inputFields,
                                            indexOfFirstData: index,
                                            indexOfSecondData: i,
                                            dataKey: "file",
                                            dataValue: e.target,
                                            callback: SetInputFields,
                                        };
                                        handleChange(changeData);
                                    }}
                                />{" "}
                                {inputFields[index]?.[i]["file"] ? (
                                    `已選擇檔案`
                                ) : (
                                    <>
                                        <FiUpload /> 選擇檔案
                                    </>
                                )}
                            </FileLabel>
                            <ButtonArea>
                                <MyButton
                                    buttonWord="上傳"
                                    buttonId={homework.title}
                                    clickFunction={e =>
                                        handleUploadHomework(e, index, i)
                                    }
                                    width="130px"
                                />
                            </ButtonArea>
                        </NotUploadHomework>
                    ))
                )}
            </StudentUploadHomework>
        );
    };

    const handleUploadHomework = (e, indexOfAllCourse, indexOfAllHomework) => {
        if (
            !inputFields?.[`${indexOfAllCourse}`]?.[`${indexOfAllHomework}`][
                "file"
            ]
        )
            return handleAlertModal("請選擇檔案");
        console.log(
            inputFields[`${indexOfAllCourse}`][`${indexOfAllHomework}`]["file"]
                .files[0],
        );

        const mountainImagesRef = ref(
            firebaseInit.storage,
            e.target.id +
                inputFields[`${indexOfAllCourse}`][`${indexOfAllHomework}`][
                    "file"
                ].value,
        );

        const uploadTask = uploadBytesResumable(
            mountainImagesRef,
            inputFields[`${indexOfAllCourse}`][`${indexOfAllHomework}`]["file"]
                .files[0],
        );

        uploadTask.on(
            "state_changed",
            snapshot => {
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
                console.log(error);
                handleAlertModal("上傳失敗");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async downloadURL => {
                        const homeworkData = {
                            title: e.target.id,
                            fileURL: downloadURL,
                            uploadDate: Timestamp.now(),
                        };
                        await updateDoc(
                            doc(
                                firebaseInit.db,
                                "courses",
                                courseDetails[indexOfAllCourse].courseID,
                                "students",
                                userID,
                            ),
                            {
                                homework: arrayUnion(homeworkData),
                            },
                        );
                        let data = [...courseDetails];
                        data[indexOfAllCourse].myHomework = [
                            ...data[indexOfAllCourse].myHomework,
                            homeworkData,
                        ];

                        setCourseDetails(data);
                        setIsLoading(false);
                        return handleAlertModal("上傳成功");
                    })
                    .catch(error => {
                        setIsLoading(false);
                        console.log(error);
                        handleAlertModal("上傳失敗");
                    });
            },
        );
    };

    return (
        <>
            {!courseDetails ? (
                <Loading />
            ) : courseDetails.length === 0 ? (
                <Container>
                    <NoDataBox
                        marginTop="35px"
                        marginLeft="180px"
                        title="還沒有進行中的課程喔，快去逛逛！"
                        buttonWord="來去逛逛"
                        path="/search?q=latest"
                    />
                </Container>
            ) : (
                <Container>
                    {courseDetails.map((detail, indexOfAllCourse) => (
                        <CourseCard key={detail.courseID} show={detail.isShow}>
                            <CourseTitle
                                onClick={() => {
                                    const changeData = {
                                        data: courseDetails,
                                        indexOfFirstData: indexOfAllCourse,
                                        dataKey: "isShow",
                                        callback: setCourseDetails,
                                    };
                                    handleChange(changeData);
                                }}
                            >
                                {" "}
                                <span>
                                    {detail.isShow ? (
                                        <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                                    ) : (
                                        <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                                    )}{" "}
                                </span>
                                {detail.title} <Name>{detail.teacherName}</Name>
                            </CourseTitle>
                            <Title>課程作業</Title>
                            {detail.allHomework.length === 0 ? (
                                <NoDataTitle title="尚無作業" />
                            ) : (
                                <AllHomeworkArea>
                                    <SubTitle>已完成</SubTitle>
                                    {renderUploadedHomework(indexOfAllCourse)}
                                    <SubTitle>未完成</SubTitle>
                                    {renderNotUploadedHomework(
                                        indexOfAllCourse,
                                    )}
                                </AllHomeworkArea>
                            )}{" "}
                            <Title>課程資料</Title>
                            {detail.materials.length === 0 ? (
                                <NoDataTitle title="無資料" />
                            ) : (
                                <AllHomeworkArea>
                                    <StudentUploadHomework>
                                        {detail.materials.map(material => (
                                            <UploadHomework
                                                key={material.creatDate.seconds}
                                            >
                                                <HomeworkTitle>
                                                    {material.title}
                                                </HomeworkTitle>

                                                <HomeworkDate>
                                                    {customDateDisplay(
                                                        material.creatDate
                                                            .seconds * 1000,
                                                    )}
                                                </HomeworkDate>

                                                <HomeworkDownload>
                                                    <a
                                                        href={material.fileURL}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        下載
                                                    </a>
                                                </HomeworkDownload>
                                            </UploadHomework>
                                        ))}
                                    </StudentUploadHomework>
                                </AllHomeworkArea>
                            )}
                        </CourseCard>
                    ))}
                </Container>
            )}
            {isLoading ? <LoadingForPost /> : ""}
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
};
