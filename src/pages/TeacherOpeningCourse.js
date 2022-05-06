import React, { useEffect, useRef, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import {
    updateDoc,
    doc,
    addDoc,
    collection,
    arrayUnion,
    Timestamp,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { breakPoint } from "../utils/breakPoint";
import { MyButton } from "../Component/MyButton";
import { TextInput } from "../Component/TextInput";
import { FiUpload } from "react-icons/fi";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { NoDataTitle } from "../Component/NoDataTitle";
import { AlertModal } from "../Component/AlertModal";
import { useAlertModal } from "../customHooks/useAlertModal";
import { Loading } from "../Component/Loading";
import { LoadingForPost } from "../Component/LoadingForPost";

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
    height: ${props => (props.isShow ? "fit-content" : "50px")};
    overflow: hidden;

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

const InputLabel = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;

    cursor: pointer;
`;

const Agreement = styled.div`
    margin-left: 5px;
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
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;

const HomeworkTitle = styled.div`
    width: 100%;
    font-weight: 700;
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
    /* font-size: 12px; */
    width: 30%;
    text-align: right;
    color: #ff6100;
    /* height: 15px;
    padding: 2px;

    text-align: center;
    background-color: rgb(0 190 164);
    color: whitesmoke;
    border-radius: 10px;
    cursor: pointer; */
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
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    @media ${breakPoint.desktop} {
        margin-bottom: 20px;
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

export const TeacherOpeningCourse = ({ userID }) => {
    const [courses, setCourses] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const imageInputRef = useRef();
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
                console.log(newCoursesArray);
            });
    }, [userID]);

    const handleAddHomework = async (e, index) => {
        const courseID = e.target.id;
        const thisCourse = courses.filter(
            course => courseID === course.courseID,
        );
        const homeworkTitle = thisCourse[0].homeworkTitle.trim();

        if (!homeworkTitle) return handleAlertModal("請輸入作業名稱");
        try {
            await updateDoc(
                doc(firebaseInit.db, "courses", courseID, "teacher", "info"),
                {
                    homework: arrayUnion({
                        title: homeworkTitle,
                        creatDate: Timestamp.now(),
                    }),
                },
            );

            let data = [...courses];
            data[index].homework = [
                ...data[index].homework,
                { title: homeworkTitle, creatDate: Timestamp.now() },
            ];
            data[index].homeworkTitle = "";

            setCourses(data);
            return handleAlertModal("設定作業成功囉!!!");
        } catch (error) {
            handleAlertModal("設定作業失敗");
            console.log(error);
        }
    };
    const handleAddMaterials = async (e, index) => {
        const courseID = e.target.id;
        const thisCourse = courses.filter(
            course => courseID === course.courseID,
        );

        const materialsTitle = thisCourse[0].materialsTitle.trim();

        const file = thisCourse[0].materialsFile.files?.[0];
        console.log(file);
        if (!materialsTitle || !file)
            return handleAlertModal("請上傳檔案並輸入教材名稱");

        console.log(courseID);
        const mountainImagesRef = ref(
            firebaseInit.storage,
            thisCourse[0].materialsFile.value,
        );
        const uploadTask = uploadBytesResumable(mountainImagesRef, file);
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
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    async downloadURL => {
                        const materialData = {
                            title: materialsTitle,
                            creatDate: Timestamp.now(),
                            fileURL: downloadURL,
                        };
                        try {
                            await updateDoc(
                                doc(
                                    firebaseInit.db,
                                    "courses",
                                    courseID,
                                    "teacher",
                                    "info",
                                ),
                                {
                                    materials: arrayUnion(materialData),
                                },
                            );

                            let data = [...courses];
                            data[index].materials = [
                                ...data[index].materials,
                                materialData,
                            ];
                            data[index].materialsTitle = "";
                            data[index].materialsFile = "";

                            setCourses(data);
                            setIsLoading(false);
                            return handleAlertModal("上傳教材成功囉");
                        } catch (error) {
                            setIsLoading(false);
                            handleAlertModal("上傳教材失敗");
                            console.log(error);
                        }
                    },
                );
            },
        );
    };

    const handleFinishCourse = async e => {
        const courseID = e.target.id;
        console.log(courseID);

        const courseArray = courses.filter(item => item.courseID === courseID);
        const checkGetSkillsStatus = courseArray[0].students
            .map(student => student.getSkillsStatus)
            .some(value => !value);

        if (checkGetSkillsStatus)
            return handleAlertModal(`課程：${courseArray[0].title}\n
        請確認所有學生獲得徽章狀態`);

        try {
            setIsLoading(true);
            await Promise.all([
                updateDoc(doc(firebaseInit.db, "courses", courseID), {
                    status: 2,
                    closedDate: new Date(),
                }),

                courseArray[0].getSkills.forEach(skill => {
                    courseArray[0].students.forEach(student => {
                        const studentID = student.studentID;
                        const getSkillsStatus = student.getSkillsStatus;
                        if (getSkillsStatus === 1)
                            addDoc(
                                collection(
                                    firebaseInit.db,
                                    "users",
                                    studentID,
                                    "getSkills",
                                ),
                                {
                                    getDate: new Date(),
                                    skillID: skill,
                                    userID: student.studentID,
                                },
                            );
                    });
                }),
            ]).then(() => {
                const NewCourses = courses.filter(
                    item => item.courseID !== courseID,
                );
                setCourses(NewCourses);
                setIsLoading(false);
            });

            return handleAlertModal("結束上課囉!!!");
        } catch (error) {
            setIsLoading(false);
            handleAlertModal("結束上課失敗");
            console.log(error);
        }
    };

    const handleTitleChange = (index, event) => {
        let data = [...courses];
        data[index][event.target.name] = event.target.value;

        setCourses(data);
    };

    const handleFileChange = (index, event) => {
        let data = [...courses];
        data[index][event.target.name] = event.target;
        console.log(data);

        setCourses(data);
    };

    const handleSkillChange = e => {
        const stateCopy = JSON.parse(JSON.stringify(courses));
        stateCopy.forEach(courses => {
            courses.students.forEach(student => {
                if (
                    e.target.name === `${courses.courseID}_${student.studentID}`
                ) {
                    student.getSkillsStatus = +e.target.value;
                }
            });
        });
        console.log(stateCopy);

        setCourses(stateCopy);
    };

    const handleIsShow = index => {
        let data = [...courses];
        data[index]["isShow"] = !data[index]["isShow"];
        setCourses(data);
    };

    return (
        <>
            {!courses ? (
                <Loading />
            ) : (
                <Container>
                    {courses.length === 0 ? (
                        <NoDataTitle title="目前沒有課程喔" />
                    ) : (
                        courses?.map((course, index) => (
                            <CourseCard key={index} isShow={course.isShow}>
                                <CourseTitle
                                    onClick={() => handleIsShow(index)}
                                >
                                    {course.isShow ? (
                                        <MdKeyboardArrowDown viewBox="0 -4 24 24" />
                                    ) : (
                                        <MdKeyboardArrowRight viewBox="0 -4 24 24" />
                                    )}{" "}
                                    {course.title}
                                </CourseTitle>
                                {course.students.map((student, index) => (
                                    <StudentInfoBoc key={index}>
                                        <Name>{student.name}</Name>
                                        <StudentUploadHomework>
                                            <Title>上傳作業</Title>

                                            {student.studentsHomework.length ===
                                            0 ? (
                                                <div>
                                                    尚未設定作業或尚未上傳
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
                                                                {new Date(
                                                                    homework
                                                                        .uploadDate
                                                                        .seconds *
                                                                        1000,
                                                                ).toLocaleDateString()}
                                                            </HomeworkDate>
                                                            <HomeworkDownload>
                                                                <a
                                                                    href={
                                                                        homework.fileURL
                                                                    }
                                                                    download
                                                                >
                                                                    下載
                                                                </a>
                                                            </HomeworkDownload>
                                                        </UploadHomework>
                                                    ),
                                                )
                                            )}
                                        </StudentUploadHomework>

                                        <InputArea>
                                            <InputLabel
                                                htmlFor={`${course.courseID}_${student.studentID}_agree`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`${course.courseID}_${student.studentID}_agree`}
                                                    name={`${course.courseID}_${student.studentID}`}
                                                    value={1}
                                                    onChange={e =>
                                                        handleSkillChange(e)
                                                    }
                                                />
                                                <Agreement>
                                                    同意給徽章
                                                </Agreement>
                                            </InputLabel>{" "}
                                            <InputLabel
                                                htmlFor={`${course.courseID}_${student.studentID}_disagree`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`${course.courseID}_${student.studentID}_disagree`}
                                                    name={`${course.courseID}_${student.studentID}`}
                                                    value={2}
                                                    onChange={e =>
                                                        handleSkillChange(e)
                                                    }
                                                />
                                                <Agreement>
                                                    不同意給徽章
                                                </Agreement>
                                            </InputLabel>
                                        </InputArea>
                                    </StudentInfoBoc>
                                ))}
                                <TeacherBox>
                                    <TeacherBoxTitle>課程資料</TeacherBoxTitle>
                                    <Title>已上傳資料</Title>
                                    <TeacherHomeworkBox>
                                        {course.materials.length === 0
                                            ? "尚未上傳"
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
                                                              {new Date(
                                                                  Math.floor(
                                                                      material
                                                                          .creatDate
                                                                          .seconds *
                                                                          1000,
                                                                  ),
                                                              ).toLocaleDateString()}
                                                          </HomeworkDate>
                                                          <HomeworkDownload>
                                                              <a
                                                                  href={
                                                                      material.fileURL
                                                                  }
                                                                  download
                                                              >
                                                                  下載
                                                              </a>
                                                          </HomeworkDownload>
                                                      </UploadHomework>
                                                  ),
                                              )}
                                    </TeacherHomeworkBox>

                                    <Title>新增檔案</Title>
                                    <FileLabel htmlFor={`${course.courseID}`}>
                                        <FileInput
                                            type="file"
                                            ref={imageInputRef}
                                            name="materialsFile"
                                            id={`${course.courseID}`}
                                            onChange={e =>
                                                handleFileChange(index, e)
                                            }
                                        />
                                        {course.materialsFile ? (
                                            `已選擇檔案，請輸入資料名稱後上傳`
                                        ) : (
                                            <>
                                                選擇檔案 <FiUpload />
                                            </>
                                        )}
                                    </FileLabel>
                                    <TextInput
                                        title="資料名稱"
                                        value={course.materialsTitle}
                                        name="materialsTitle"
                                        handleChange={e =>
                                            handleTitleChange(index, e)
                                        }
                                    />
                                    <ButtonArea>
                                        <MyButton
                                            buttonWord="上傳"
                                            buttonId={course.courseID}
                                            clickFunction={e =>
                                                handleAddMaterials(e, index)
                                            }
                                        />
                                    </ButtonArea>
                                </TeacherBox>
                                <TeacherBox>
                                    <TeacherBoxTitle>課程作業</TeacherBoxTitle>
                                    <Title>已設定作業</Title>
                                    <TeacherHomeworkBox>
                                        {course.homework.length === 0 ? (
                                            <div>無資料</div>
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
                                                        {new Date(
                                                            Math.floor(
                                                                homework
                                                                    .creatDate
                                                                    .seconds *
                                                                    1000,
                                                            ),
                                                        ).toLocaleDateString()}
                                                    </TeacherHomeworkDate>
                                                </TeacherHomework>
                                            ))
                                        )}
                                    </TeacherHomeworkBox>
                                    <Title>設定作業</Title>
                                    <TextInput
                                        title="作業名稱"
                                        value={course.homeworkTitle}
                                        name="homeworkTitle"
                                        handleChange={e =>
                                            handleTitleChange(index, e)
                                        }
                                    />
                                    <ButtonArea>
                                        <MyButton
                                            buttonWord="設定作業"
                                            buttonId={course.courseID}
                                            clickFunction={e =>
                                                handleAddHomework(e, index)
                                            }
                                        />
                                    </ButtonArea>
                                </TeacherBox>
                                <LastButtonArea>
                                    <MyButton
                                        buttonWord="結束課程"
                                        buttonId={course.courseID}
                                        clickFunction={handleFinishCourse}
                                    />
                                </LastButtonArea>
                            </CourseCard>
                        ))
                    )}
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
