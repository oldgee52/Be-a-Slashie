import React, { useEffect, useRef, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";
import {
    updateDoc,
    doc,
    collection,
    getDocs,
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
    const [homeworkTitle, setHomeworkTitle] = useState("");
    const [materialsTitle, setMaterialsTitle] = useState("");
    const [file, setFile] = useState();
    const imageInputRef = useRef();

    useEffect(() => {
        const teacherID = "QptFGccbXGVyiTwmvxFG07JNbjp1";
        firebaseInit.getOpeningCorses(teacherID).then(data => {
            setCourses(data);
            console.log(data);
        });
    }, []);

    const handleAddHomework = async e => {
        const courseID = e.target.id;
        console.log(courseID);

        if (!homeworkTitle.trim()) return window.alert("請輸入作業名稱");

        const teacherCol = collection(
            firebaseInit.db,
            "courses",
            courseID,
            "teacher",
        );
        try {
            const teacherSnapshot = await getDocs(teacherCol);
            const docID = teacherSnapshot.docs.map(doc => doc.id);
            console.log(docID);

            await updateDoc(
                doc(firebaseInit.db, "courses", courseID, "teacher", docID[0]),
                {
                    homework: arrayUnion({
                        title: homeworkTitle,
                        creatData: new Date(),
                    }),
                },
            );
            setHomeworkTitle("");
            return window.alert("設定作業成功囉!!!");
        } catch (error) {
            window.alert("設定作業失敗");
            console.log(error);
        }
    };
    const handleAddMaterials = async e => {
        if (!materialsTitle.trim() || !file)
            return window.alert("請上傳檔案並輸入教材名稱");

        const courseID = e.target.id;
        console.log(courseID);
        const mountainImagesRef = ref(firebaseInit.storage, materialsTitle);
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
                        const teacherCol = collection(
                            firebaseInit.db,
                            "courses",
                            courseID,
                            "teacher",
                        );
                        try {
                            const teacherSnapshot = await getDocs(teacherCol);
                            const docID = teacherSnapshot.docs.map(
                                doc => doc.id,
                            );

                            await updateDoc(
                                doc(
                                    firebaseInit.db,
                                    "courses",
                                    courseID,
                                    "teacher",
                                    docID[0],
                                ),
                                {
                                    materials: arrayUnion({
                                        title: materialsTitle,
                                        creatData: new Date(),
                                        fileURL: downloadURL,
                                    }),
                                },
                            );
                            setMaterialsTitle("");
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

    return (
        <Container>
            {courses?.length === 0 ? (
                <div>目前沒有課程喔</div>
            ) : (
                courses?.map(course => (
                    <Div1 key={course.courseID}>
                        <DivCourse>{course.title}</DivCourse>
                        {course.students.map((student, index) => (
                            <Div1 key={index}>
                                <DivContent>
                                    <div>{student.name}</div>
                                    <div>{student.email}</div>
                                    <Div1>
                                        <input
                                            type="radio"
                                            id={`${course.courseID}_${student.studentID}_agree`}
                                            name={`${course.courseID}_${student.studentID}`}
                                            value={1}
                                        />
                                        <label
                                            htmlFor={`${course.courseID}_${student.studentID}_agree`}
                                        >
                                            同意
                                        </label>
                                    </Div1>
                                    <Div1>
                                        <input
                                            type="radio"
                                            id={`${course.courseID}_${student.studentID}_disagree`}
                                            name={`${course.courseID}_${student.studentID}`}
                                            value={2}
                                        />
                                        <label
                                            htmlFor={`${course.courseID}_${student.studentID}_disagree`}
                                        >
                                            不同意
                                        </label>
                                    </Div1>
                                </DivContent>
                            </Div1>
                        ))}
                        <DivContent>
                            <DivCourse>課程資料</DivCourse>
                            <Div1>
                                {course.materials?.map(material => (
                                    <Div1 key={material.creatData.seconds}>
                                        <DivA href={material.fileURL} download>
                                            {material.title}
                                        </DivA>

                                        <Div1>
                                            上傳日期:
                                            {new Date(
                                                Math.floor(
                                                    material.creatData.seconds *
                                                        1000,
                                                ),
                                            ).toLocaleDateString()}
                                        </Div1>
                                    </Div1>
                                ))}
                            </Div1>
                            <Input
                                type="file"
                                ref={imageInputRef}
                                onChange={e => setFile(e.target.files[0])}
                            />
                            <Input
                                value={materialsTitle}
                                onChange={e =>
                                    setMaterialsTitle(e.target.value)
                                }
                            />
                            <Button
                                id={course.courseID}
                                onClick={handleAddMaterials}
                            >
                                上傳
                            </Button>
                        </DivContent>
                        <DivContent>
                            <DivCourse>設定作業</DivCourse>
                            <Div1>
                                {course.homework?.map(homework => (
                                    <Div1 key={homework.creatData.seconds}>
                                        {homework.title} 設定日期:
                                        {new Date(
                                            Math.floor(
                                                homework.creatData.seconds *
                                                    1000,
                                            ),
                                        ).toLocaleDateString()}
                                        {new Date(
                                            Math.floor(
                                                homework.creatData.seconds *
                                                    1000,
                                            ),
                                        ).toLocaleTimeString()}
                                    </Div1>
                                ))}
                            </Div1>
                            <Input
                                value={homeworkTitle}
                                onChange={e => setHomeworkTitle(e.target.value)}
                                key={course.courseID}
                            />
                            <Button
                                id={course.courseID}
                                onClick={handleAddHomework}
                            >
                                設定作業
                            </Button>
                        </DivContent>
                    </Div1>
                ))
            )}
        </Container>
    );
};
