import React, { useEffect, useRef, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import {
    updateDoc,
    doc,
    addDoc,
    collection,
    arrayUnion,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Container = styled.div`
    margin: auto;
    margin-top: 100px;
    margin-bottom: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 500px;
`;

const Div1 = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

const DivA = styled.a`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

const DivCourse = styled.h3`
    width: 100%;
`;

const DivContent = styled.div`
    width: 80%;
    padding-top: 10px;
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
const Input = styled.input`
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
    margin-top: 20px;
`;

export const TeacherOpeningCourse = () => {
    const [courses, setCourses] = useState();
    const imageInputRef = useRef();

    useEffect(() => {
        const teacherID = "QptFGccbXGVyiTwmvxFG07JNbjp1";
        firebaseInit.getTeacherOpeningCorses(teacherID).then(data => {
            const newCoursesArray = data.map(newCourses => ({
                ...newCourses,
                homeworkTitle: "",
                materialsTitle: "",
                materialsFile: "",
            }));

            setCourses(newCoursesArray);
            console.log(newCoursesArray);
        });
    }, []);

    const handleAddHomework = async e => {
        const courseID = e.target.id;
        const thisCourse = courses.filter(
            course => courseID === course.courseID,
        );
        const homeworkTitle = thisCourse[0].homeworkTitle.trim();

        if (!homeworkTitle) return window.alert("請輸入作業名稱");
        try {
            await updateDoc(
                doc(firebaseInit.db, "courses", courseID, "teacher", "info"),
                {
                    homework: arrayUnion({
                        title: homeworkTitle,
                        creatDate: new Date(),
                    }),
                },
            );
            window.alert("設定作業成功囉!!!");
            return window.location.reload();
        } catch (error) {
            window.alert("設定作業失敗");
            console.log(error);
        }
    };
    const handleAddMaterials = async e => {
        const courseID = e.target.id;
        const thisCourse = courses.filter(
            course => courseID === course.courseID,
        );
        const materialsTitle = thisCourse[0].materialsTitle.trim();
        const materialsFile = thisCourse[0].materialsFile;
        if (!materialsTitle || !materialsFile)
            return window.alert("請上傳檔案並輸入教材名稱");

        console.log(courseID);
        const mountainImagesRef = ref(firebaseInit.storage, materialsTitle);
        const uploadTask = uploadBytesResumable(
            mountainImagesRef,
            materialsFile,
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
                getDownloadURL(uploadTask.snapshot.ref).then(
                    async downloadURL => {
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
                                    materials: arrayUnion({
                                        title: materialsTitle,
                                        creatDate: new Date(),
                                        fileURL: downloadURL,
                                    }),
                                },
                            );

                            imageInputRef.current.value = "";
                            return window.alert("上傳教材成功囉!!!");
                        } catch (error) {
                            window.alert("上傳教材失敗");
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
        console.log(courseArray[0]);

        try {
            await Promise.all([
                updateDoc(doc(firebaseInit.db, "courses", courseID), {
                    status: 2,
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
            ]);
            window.alert("結束上課囉!!!");
            return window.location.reload();
        } catch (error) {
            window.alert("結束上課失敗");
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
        data[index][event.target.name] = event.target.files[0];

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

        setCourses(stateCopy);
    };

    return (
        <Container>
            {courses?.length === 0 ? (
                <div>目前沒有課程喔</div>
            ) : (
                courses?.map((course, index) => (
                    <Div1 key={course.courseID}>
                        <DivCourse>{course.title}</DivCourse>
                        {course.students.map((student, index) => (
                            <Div1 key={index}>
                                <DivContent>
                                    <div>{student.name}</div>
                                    <div>{student.email}</div>
                                    <DivCourse>上傳作業</DivCourse>

                                    {student.studentsHomework.length === 0 ? (
                                        <div>尚未有作業</div>
                                    ) : (
                                        student.studentsHomework.map(
                                            homework => (
                                                <div key={homework.title}>
                                                    <div>{homework.title}</div>
                                                    <>
                                                        <a
                                                            href={
                                                                homework.fileURL
                                                            }
                                                            download
                                                        >
                                                            點我下載
                                                        </a>
                                                        <div>
                                                            上傳日期:
                                                            {new Date(
                                                                homework
                                                                    .uploadDate
                                                                    .seconds *
                                                                    1000,
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </>
                                                </div>
                                            ),
                                        )
                                    )}
                                    <br></br>
                                    <Div1>
                                        <input
                                            type="radio"
                                            id={`${course.courseID}_${student.studentID}_agree`}
                                            name={`${course.courseID}_${student.studentID}`}
                                            value={1}
                                            onChange={e => handleSkillChange(e)}
                                        />
                                        <label
                                            htmlFor={`${course.courseID}_${student.studentID}_agree`}
                                        >
                                            同意給徽章
                                        </label>
                                    </Div1>
                                    <Div1>
                                        <input
                                            type="radio"
                                            id={`${course.courseID}_${student.studentID}_disagree`}
                                            name={`${course.courseID}_${student.studentID}`}
                                            value={2}
                                            onChange={e => handleSkillChange(e)}
                                        />
                                        <label
                                            htmlFor={`${course.courseID}_${student.studentID}_disagree`}
                                        >
                                            不同意給徽章
                                        </label>
                                    </Div1>
                                </DivContent>
                            </Div1>
                        ))}
                        <DivContent>
                            <DivCourse>課程資料</DivCourse>
                            <DivCourse>已上傳資料</DivCourse>
                            <Div1>
                                {course.materials.length === 0 ? (
                                    <div>無資料</div>
                                ) : (
                                    course.materials?.map(material => (
                                        <Div1 key={material.fileURL}>
                                            <DivA
                                                href={material.fileURL}
                                                download
                                            >
                                                {material.title}
                                            </DivA>

                                            <Div1>
                                                上傳日期:
                                                {new Date(
                                                    Math.floor(
                                                        material.creatDate
                                                            .seconds * 1000,
                                                    ),
                                                ).toLocaleDateString()}
                                            </Div1>
                                        </Div1>
                                    ))
                                )}
                            </Div1>
                            <Input
                                type="file"
                                ref={imageInputRef}
                                name="materialsFile"
                                onChange={e => handleFileChange(index, e)}
                            />
                            <Input
                                value={course.materialsTitle}
                                name="materialsTitle"
                                onChange={e => {
                                    handleTitleChange(index, e);
                                }}
                            />
                            <Button
                                id={course.courseID}
                                onClick={handleAddMaterials}
                            >
                                上傳
                            </Button>
                        </DivContent>
                        <DivContent>
                            <DivCourse>已設定作業</DivCourse>
                            <Div1>
                                {course.homework.length === 0 ? (
                                    <div>無資料</div>
                                ) : (
                                    course.homework.map(homework => (
                                        <Div1 key={homework.title}>
                                            名稱: {homework.title} <br></br>
                                            設定日期:
                                            {new Date(
                                                Math.floor(
                                                    homework.creatDate.seconds *
                                                        1000,
                                                ),
                                            ).toLocaleDateString()}
                                            {new Date(
                                                Math.floor(
                                                    homework.creatDate.seconds *
                                                        1000,
                                                ),
                                            ).toLocaleTimeString()}
                                        </Div1>
                                    ))
                                )}
                            </Div1>
                            <DivCourse>設定作業</DivCourse>
                            <Input
                                value={course.homeworkTitle}
                                name="homeworkTitle"
                                onChange={e => {
                                    handleTitleChange(index, e);
                                }}
                            />
                            <Button
                                id={course.courseID}
                                onClick={handleAddHomework}
                            >
                                設定作業
                            </Button>
                            <hr />
                            <Button
                                id={course.courseID}
                                onClick={handleFinishCourse}
                            >
                                結束課程
                            </Button>
                        </DivContent>
                    </Div1>
                ))
            )}
        </Container>
    );
};
