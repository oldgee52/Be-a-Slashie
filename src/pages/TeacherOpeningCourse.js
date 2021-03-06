import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FiUpload } from "react-icons/fi";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";
import firebaseInit from "../utils/firebase";
import breakPoint from "../utils/breakPoint";
import MyButton from "../Component/common/MyButton";
import TextInput from "../Component/common/TextInput";
import AlertModal from "../Component/common/AlertModal";
import useAlertModal from "../customHooks/useAlertModal";
import Loading from "../Component/loading/Loading";
import LoadingForPost from "../Component/loading/LoadingForPost";
import MyRadioButton from "../Component/common/MyRadioButton";
import NoDataBox from "../Component/common/NoDataBox";
import {
    customDateDisplay,
    handleChangeChangeForArray,
    handleChangeForDeepCopy,
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
    max-height: ${props => (props.show ? "2500px" : "50px")};
    overflow: hidden;
    transition: ${props =>
        props.show ? "max-height 1s ease-out" : "max-height 0.3s ease-in"};

    @media ${breakPoint.desktop} {
    }
`;

const CourseTitle = styled.h3`
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    line-height: 1.2;

    word-break: break-all;
    cursor: pointer;

    @media ${breakPoint.desktop} {
        font-size: 22px;
    }
`;

const StudentInfoBoc = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px 0;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 10px 0;
    border-radius: 5px;

    @media ${breakPoint.desktop} {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const TeacherBox = styled(StudentInfoBoc)`
    background-color: inherit;
`;

const Name = styled.div`
    margin-top: 5px;
    padding-left: 10px;
    @media ${breakPoint.desktop} {
        order: -2;
        width: 40%;
    }
`;

const Title = styled.h3`
    font-size: 16px;
    padding-bottom: 10px;
    @media ${breakPoint.desktop} {
        width: 100%;
    }
`;

const InputArea = styled.div`
    display: flex;
    margin: 10px 0;
    width: 100%;
    justify-content: space-around;
    @media ${breakPoint.desktop} {
        width: 50%;
        margin-top: 0;
        order: -1;
    }
`;

const StudentUploadHomework = styled.div`
    display: flex;
    margin: 10px 0;
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
    padding: 0 10px;
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

const TeacherBoxTitle = styled.h3`
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
`;

const FileLabel = styled.label`
    @media ${breakPoint.desktop} {
        margin-bottom: 10px;
    }
`;
const FileInput = styled.input`
    display: none;
`;

const TeacherHomeworkBox = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;
    padding: 0 10px;
    @media ${breakPoint.desktop} {
    }
`;
const TeacherHomework = styled.div`
    display: flex;
    width: 100%;
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;
const TeacherHomeworkDate = styled.div`
    width: 50%;
    text-align: right;
`;

const ButtonArea = styled.div`
    width: 100%;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);

    @media ${breakPoint.desktop} {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const LastButtonArea = styled(ButtonArea)`
    padding-bottom: 0;
    border-bottom: none;
`;

function TeacherOpeningCourse({ userID }) {
    const [courses, setCourses] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const imageInputRef = useRef();
    const [uploadIsLoading, uploadFile] = useFirebaseUploadFile();
    const [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal] =
        useAlertModal();

    useEffect(() => {
        if (userID)
            firebaseInit.getTeachersStatusCourses(userID, 1).then(data => {
                const newCoursesArray = data.map(newCourses => ({
                    ...newCourses,
                    homeworkTitle: "",
                    materialsTitle: "",
                    materialsFile: "",
                    isShow: false,
                }));

                setCourses(newCoursesArray);
            });
    }, [userID]);

    const handleAddHomework = async (e, index) => {
        const courseID = e.target.id;
        const thisCourse = courses.filter(
            course => courseID === course.courseID,
        );
        const homeworkTitle = thisCourse[0].homeworkTitle.trim();

        if (!homeworkTitle) return handleAlertModal("?????????????????????");
        try {
            const homeworkInfo =
                await firebaseInit.updateDocForTeacherAddHomework(
                    courseID,
                    homeworkTitle,
                );

            const data = [...courses];
            data[index].homework = [...data[index].homework, homeworkInfo];
            data[index].homeworkTitle = "";
            setCourses(data);
            return handleAlertModal("?????????????????????!!!");
        } catch (error) {
            handleAlertModal(`????????????????????????????????????${error}`);
        }
        return null;
    };
    const handleAddMaterials = async (e, index) => {
        const courseID = e.target.id;
        const thisCourse = courses.filter(
            course => courseID === course.courseID,
        );

        const materialsTitle = thisCourse[0].materialsTitle.trim();
        const file = thisCourse[0].materialsFile.files?.[0];
        const fileName = `${materialsTitle}_${thisCourse[0].materialsFile.value}`;

        if (!materialsTitle || !file)
            return handleAlertModal("????????????????????????????????????");

        try {
            const fileURL = await uploadFile(fileName, file);
            const materialData = await firebaseInit.updateDocForCourseMaterials(
                materialsTitle,
                fileURL,
                courseID,
            );
            const data = [...courses];
            data[index].materials = [...data[index].materials, materialData];
            data[index].materialsTitle = "";
            data[index].materialsFile = "";
            setCourses(data);
            setIsLoading(false);
            return handleAlertModal("?????????????????????");
        } catch (error) {
            setIsLoading(false);
            handleAlertModal(`????????????????????????????????????${error}`);
        }

        return null;
    };

    const handleFinishCourse = async e => {
        const courseID = e.target.id;
        const courseArray = courses.filter(item => item.courseID === courseID);
        const checkGetSkillsStatus = courseArray[0].students
            .map(student => student.getSkillsStatus)
            .some(value => !value);

        if (checkGetSkillsStatus)
            return handleAlertModal(`?????????${courseArray[0].title}\n
        ???????????????????????????????????????`);

        try {
            setIsLoading(true);
            await Promise.all([
                firebaseInit.updateDocForTeacherFinishCourse(courseID),
                firebaseInit.addDocForHandleStudentsGetSkills(courseArray[0]),
            ]).then(() => {
                const NewCourses = courses.filter(
                    item => item.courseID !== courseID,
                );
                setCourses(NewCourses);
                setIsLoading(false);
            });

            return handleAlertModal("???????????????!!!");
        } catch (error) {
            setIsLoading(false);
            handleAlertModal(`????????????????????????????????????${error}`);
        }
        return null;
    };

    const handleSkillChange = e => {
        const dataChange = {
            data: courses,
            targetName: e.target.name,
            dataKey: "getSkillsStatus",
            dataValue: +e.target.value,
            callback: setCourses,
        };
        handleChangeForDeepCopy(dataChange);
    };

    const changeData = {
        data: courses,
        callback: setCourses,
    };

    return (
        <>
            {!courses ? (
                <Loading />
            ) : (
                <Container>
                    {courses.length === 0 ? (
                        <NoDataBox
                            marginTop="35px"
                            marginLeft="140px"
                            title="???????????????????????????????????????????????????"
                            buttonWord="????????????"
                            path="/personal/teacher-upload-course"
                        />
                    ) : (
                        courses?.map((course, index) => (
                            <CourseCard
                                key={course.courseID}
                                show={course.isShow}
                            >
                                <CourseTitle
                                    onClick={() =>
                                        handleChangeChangeForArray({
                                            ...changeData,
                                            indexOfFirstData: index,
                                            dataKey: "isShow",
                                        })
                                    }
                                >
                                    {course.isShow ? (
                                        <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                                    ) : (
                                        <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                                    )}{" "}
                                    {course.title}
                                </CourseTitle>
                                {course.students.map(student => (
                                    <StudentInfoBoc
                                        key={course.courseID + student.name}
                                    >
                                        <Name>{student.name}</Name>
                                        <StudentUploadHomework>
                                            <Title>????????????</Title>

                                            {student.studentsHomework.length ===
                                            0 ? (
                                                <div>
                                                    ?????????????????????????????????
                                                </div>
                                            ) : (
                                                student.studentsHomework.map(
                                                    homework => (
                                                        <UploadHomework
                                                            key={homework.title}
                                                        >
                                                            <HomeworkTitle>
                                                                {homework.title}
                                                            </HomeworkTitle>{" "}
                                                            <HomeworkDate>
                                                                {customDateDisplay(
                                                                    homework
                                                                        .uploadDate
                                                                        .seconds *
                                                                        1000,
                                                                )}
                                                            </HomeworkDate>
                                                            <HomeworkDownload>
                                                                <a
                                                                    href={
                                                                        homework.fileURL
                                                                    }
                                                                    download
                                                                >
                                                                    ??????
                                                                </a>
                                                            </HomeworkDownload>
                                                        </UploadHomework>
                                                    ),
                                                )
                                            )}
                                        </StudentUploadHomework>

                                        <InputArea>
                                            <MyRadioButton
                                                title="???????????????"
                                                inputId={`${course.courseID}_${student.studentID}_agree`}
                                                inputName={`${course.courseID}_${student.studentID}`}
                                                inputValue={1}
                                                changeFunction={
                                                    handleSkillChange
                                                }
                                            />
                                            <MyRadioButton
                                                title="??????????????????"
                                                inputId={`${course.courseID}_${student.studentID}_disagree`}
                                                inputName={`${course.courseID}_${student.studentID}`}
                                                inputValue={2}
                                                changeFunction={
                                                    handleSkillChange
                                                }
                                            />
                                        </InputArea>
                                    </StudentInfoBoc>
                                ))}
                                <TeacherBox>
                                    <TeacherBoxTitle>????????????</TeacherBoxTitle>
                                    <Title>???????????????</Title>
                                    <TeacherHomeworkBox>
                                        {course.materials.length === 0
                                            ? "????????????"
                                            : course.materials?.map(
                                                  material => (
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
                                                                  Math.floor(
                                                                      material
                                                                          .creatDate
                                                                          .seconds *
                                                                          1000,
                                                                  ),
                                                              )}
                                                          </HomeworkDate>
                                                          <HomeworkDownload>
                                                              <a
                                                                  href={
                                                                      material.fileURL
                                                                  }
                                                                  download
                                                              >
                                                                  ??????
                                                              </a>
                                                          </HomeworkDownload>
                                                      </UploadHomework>
                                                  ),
                                              )}
                                    </TeacherHomeworkBox>

                                    <Title>????????????</Title>
                                    <FileLabel htmlFor={`${course.courseID}`}>
                                        <FileInput
                                            type="file"
                                            ref={imageInputRef}
                                            name="materialsFile"
                                            id={`${course.courseID}`}
                                            onChange={e =>
                                                handleChangeChangeForArray({
                                                    ...changeData,
                                                    indexOfFirstData: index,
                                                    dataKey: e.target.name,
                                                    dataValue: e.target,
                                                })
                                            }
                                        />
                                        {course.materialsFile ? (
                                            `????????????????????????????????????????????????`
                                        ) : (
                                            <>
                                                ???????????? <FiUpload />
                                            </>
                                        )}
                                    </FileLabel>
                                    <TextInput
                                        title="????????????"
                                        value={course.materialsTitle}
                                        name="materialsTitle"
                                        handleChange={e =>
                                            handleChangeChangeForArray({
                                                ...changeData,
                                                indexOfFirstData: index,
                                                dataKey: e.target.name,
                                                dataValue: e.target.value,
                                            })
                                        }
                                    />
                                    <ButtonArea>
                                        <MyButton
                                            buttonWord="??????"
                                            buttonId={course.courseID}
                                            clickFunction={e =>
                                                handleAddMaterials(e, index)
                                            }
                                        />
                                    </ButtonArea>
                                </TeacherBox>
                                <TeacherBox>
                                    <TeacherBoxTitle>????????????</TeacherBoxTitle>
                                    <Title>???????????????</Title>
                                    <TeacherHomeworkBox>
                                        {course.homework.length === 0 ? (
                                            <div>?????????</div>
                                        ) : (
                                            course.homework.map(homework => (
                                                <TeacherHomework
                                                    key={
                                                        homework.creatDate
                                                            .seconds
                                                    }
                                                >
                                                    <HomeworkTitle>
                                                        {homework.title}
                                                    </HomeworkTitle>
                                                    <TeacherHomeworkDate>
                                                        {customDateDisplay(
                                                            Math.floor(
                                                                homework
                                                                    .creatDate
                                                                    .seconds *
                                                                    1000,
                                                            ),
                                                        )}
                                                    </TeacherHomeworkDate>
                                                </TeacherHomework>
                                            ))
                                        )}
                                    </TeacherHomeworkBox>
                                    <Title>????????????</Title>
                                    <TextInput
                                        title="????????????"
                                        value={course.homeworkTitle}
                                        name="homeworkTitle"
                                        handleChange={e =>
                                            handleChangeChangeForArray({
                                                ...changeData,
                                                indexOfFirstData: index,
                                                dataKey: e.target.name,
                                                dataValue: e.target.value,
                                            })
                                        }
                                    />
                                    <ButtonArea>
                                        <MyButton
                                            buttonWord="????????????"
                                            buttonId={course.courseID}
                                            clickFunction={e =>
                                                handleAddHomework(e, index)
                                            }
                                        />
                                    </ButtonArea>
                                </TeacherBox>
                                <LastButtonArea>
                                    <MyButton
                                        buttonWord="????????????"
                                        buttonId={course.courseID}
                                        clickFunction={handleFinishCourse}
                                    />
                                </LastButtonArea>
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
TeacherOpeningCourse.propTypes = {
    userID: PropTypes.string.isRequired,
};

export default TeacherOpeningCourse;
