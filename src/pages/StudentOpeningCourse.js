import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiUpload } from "react-icons/fi";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import breakPoint from "../utils/breakPoint";
import firebaseInit from "../utils/firebase";
import useAlertModal from "../customHooks/useAlertModal";
import NoDataTitle from "../Component/common/NoDataTitle";
import MyButton from "../Component/common/MyButton";
import AlertModal from "../Component/common/AlertModal";
import NoDataBox from "../Component/common/NoDataBox";
import Loading from "../Component/loading/Loading";
import LoadingForPost from "../Component/loading/LoadingForPost";
import {
    customDateDisplay,
    getNotMatchTitleArray,
    getTheSameTitleArray,
    handleChangeChangeForArray,
} from "../utils/functions";
import useFirebaseUploadFile from "../customHooks/useFirebaseUploadFile";

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

function StudentOpeningCourse({ userID }) {
    const [courseDetails, setCourseDetails] = useState();
    const [inputFields, SetInputFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadIsLoading, uploadFile] = useFirebaseUploadFile();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();
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

    const renderUploadedHomework = index => {
        const allHomework = courseDetails.map(detail => detail.allHomework);
        const myHomework = courseDetails.map(detail => detail.myHomework);
        const uploadedHomework = getTheSameTitleArray(
            myHomework[index],
            allHomework[index],
        );

        return (
            <StudentUploadHomework>
                {uploadedHomework.length === 0 ? (
                    <NoDataTitle title="???" />
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
                                    ??????
                                </a>
                            </HomeworkDownload>
                        </UploadHomework>
                    ))
                )}
            </StudentUploadHomework>
        );
    };

    const handleUploadHomework = async (
        e,
        indexOfAllCourse,
        indexOfAllHomework,
    ) => {
        const fileInfo =
            inputFields?.[`${indexOfAllCourse}`]?.[`${indexOfAllHomework}`]
                .file;
        if (!fileInfo) return handleAlertModal("???????????????");
        const { courseID } = courseDetails[indexOfAllCourse];
        setIsLoading(true);

        try {
            const fileURL = await uploadFile(fileInfo.value, fileInfo.files[0]);
            const homeworkData =
                await firebaseInit.updateDocForStudentsHomework(
                    e.target.id,
                    fileURL,
                    courseID,
                    userID,
                );

            const data = [...courseDetails];
            data[indexOfAllCourse].myHomework = [
                ...data[indexOfAllCourse].myHomework,
                homeworkData,
            ];

            setCourseDetails(data);
            setIsLoading(false);
            return handleAlertModal("????????????");
        } catch (error) {
            setIsLoading(false);
            handleAlertModal(`??????????????????????????????${error}`);
        }
        return null;
    };

    const renderNotUploadedHomework = index => {
        const allHomework = courseDetails.map(detail => detail.allHomework);
        const myHomework = courseDetails.map(detail => detail.myHomework);
        const notUploadedHomework = getNotMatchTitleArray(
            allHomework[index],
            myHomework[index],
        );

        return (
            <StudentUploadHomework>
                {notUploadedHomework.length === 0 ? (
                    <NoDataTitle title="???" />
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
                                        handleChangeChangeForArray(changeData);
                                    }}
                                />{" "}
                                {inputFields[index]?.[i].file.file ? (
                                    `???????????????`
                                ) : (
                                    <>
                                        <FiUpload /> ????????????
                                    </>
                                )}
                            </FileLabel>
                            <ButtonArea>
                                <MyButton
                                    buttonWord="??????"
                                    buttonId={homework.title}
                                    clickFunction={e =>
                                        handleUploadHomework(e, index, i)
                                    }
                                    width="100%"
                                />
                            </ButtonArea>
                        </NotUploadHomework>
                    ))
                )}
            </StudentUploadHomework>
        );
    };

    return (
        <>
            {!courseDetails ? (
                <Loading />
            ) : (
                <Container>
                    {courseDetails.length === 0 ? (
                        <NoDataBox
                            marginTop="35px"
                            marginLeft="180px"
                            title="????????????????????????????????????????????????"
                            buttonWord="????????????"
                            path="/search?q=latest"
                        />
                    ) : (
                        courseDetails.map((detail, indexOfAllCourse) => (
                            <CourseCard
                                key={detail.courseID}
                                show={detail.isShow}
                            >
                                <CourseTitle
                                    onClick={() => {
                                        const changeData = {
                                            data: courseDetails,
                                            indexOfFirstData: indexOfAllCourse,
                                            dataKey: "isShow",
                                            callback: setCourseDetails,
                                        };
                                        handleChangeChangeForArray(changeData);
                                    }}
                                >
                                    <span>
                                        {detail.isShow ? (
                                            <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                                        ) : (
                                            <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                                        )}{" "}
                                    </span>
                                    {detail.title}{" "}
                                    <Name>{detail.teacherName}</Name>
                                </CourseTitle>
                                <Title>????????????</Title>
                                {detail.allHomework.length === 0 ? (
                                    <NoDataTitle title="????????????" />
                                ) : (
                                    <AllHomeworkArea>
                                        <SubTitle>?????????</SubTitle>
                                        {renderUploadedHomework(
                                            indexOfAllCourse,
                                        )}
                                        <SubTitle>?????????</SubTitle>
                                        {renderNotUploadedHomework(
                                            indexOfAllCourse,
                                        )}
                                    </AllHomeworkArea>
                                )}{" "}
                                <Title>????????????</Title>
                                {detail.materials.length === 0 ? (
                                    <NoDataTitle title="?????????" />
                                ) : (
                                    <AllHomeworkArea>
                                        <StudentUploadHomework>
                                            {detail.materials.map(material => (
                                                <UploadHomework
                                                    key={
                                                        material.creatDate
                                                            .seconds
                                                    }
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
                                                            href={
                                                                material.fileURL
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            ??????
                                                        </a>
                                                    </HomeworkDownload>
                                                </UploadHomework>
                                            ))}
                                        </StudentUploadHomework>
                                    </AllHomeworkArea>
                                )}
                            </CourseCard>
                        ))
                    )}
                </Container>
            )}
            {(isLoading || uploadIsLoading) && <LoadingForPost />}
            <AlertModal
                content={alertMessage}
                alertIsOpen={alertIsOpen}
                setAlertIsOpen={setAlertIsOpen}
            />
        </>
    );
}

StudentOpeningCourse.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default StudentOpeningCourse;
