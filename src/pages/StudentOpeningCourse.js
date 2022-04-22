import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";

const Container = styled.div`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 50px;
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

const Div12 = styled(Div1)`
    border: 1px solid black;
`;

const DivCourse = styled.h3`
    width: 100%;
`;

const DivTeacher = styled.h5`
    width: 100%;
    margin: 0;
`;

const DivContent = styled.div`
    padding-right: 20px;
`;

const Input = styled.input`
    width: 100%;
`;

export const StudentOpeningCourse = () => {
    const [courseDetails, setCourseDetails] = useState();
    const [inputFields, SetInputFields] = useState([]);
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            firebaseInit
                .getStudentOpeningCourseDetails(studentID, 1)
                .then(data => {
                    setCourseDetails(data);
                    console.log(data);

                    SetInputFields(
                        data.map(item =>
                            Array(item.allHomework?.length || 0)
                                .fill()
                                .map(() => ({ file: "" })),
                        ),
                    );
                });
        }
        return () => {
            isMounted = false;
        };
    }, []);

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

        return uploadedHomework.map(homework => (
            <Div1 key={homework.fileURL}>
                <DivContent>{homework.title} </DivContent>
                <DivContent>
                    {new Date(
                        homework.uploadDate.seconds * 1000,
                    ).toLocaleDateString()}
                </DivContent>
                <a href={homework.fileURL} download>
                    點我下載
                </a>
            </Div1>
        ));
    };

    const renderNotUploadedHomework = index => {
        const allHomework = courseDetails.map(detail => detail.allHomework);
        const myHomework = courseDetails.map(detail => detail.myHomework);
        const notUploadedHomework = getNotUploadedHomework(
            allHomework[index],
            myHomework[index],
        );

        return notUploadedHomework.map((homework, i) => (
            <Div1 key={homework.creatDate.seconds}>
                <DivContent>{homework.title}</DivContent>
                <Input
                    type="file"
                    onChange={e => handleFileChange(e, index, i)}
                />

                <button
                    id={`${homework.title}`}
                    onClick={e => handleUploadHomework(e, index, i)}
                >
                    點我上傳
                </button>
            </Div1>
        ));
    };

    const handleFileChange = (e, indexOfAllCourse, indexOfAllHomework) => {
        let newInputFields = [...inputFields];
        newInputFields[indexOfAllCourse][indexOfAllHomework]["file"] = e.target;
        SetInputFields(newInputFields);
    };

    const handleUploadHomework = (e, indexOfAllCourse, indexOfAllHomework) => {
        console.log(
            inputFields[`${indexOfAllCourse}`][`${indexOfAllHomework}`]["file"]
                .files[0],
        );

        console.log(courseDetails[indexOfAllCourse].courseID);

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
                window.alert("上傳失敗");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async downloadURL => {
                        await updateDoc(
                            doc(
                                firebaseInit.db,
                                "courses",
                                courseDetails[indexOfAllCourse].courseID,
                                "students",
                                studentID,
                            ),
                            {
                                homework: arrayUnion({
                                    title: e.target.id,
                                    fileURL: downloadURL,
                                    uploadDate: new Date(),
                                }),
                            },
                        );
                        window.alert("上傳成功");
                        return window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                        window.alert("上傳失敗");
                    });
            },
        );
    };

    return (
        <Container>
            {courseDetails &&
                courseDetails.map((detail, indexOfAllCourse) => (
                    <Div12 key={detail.courseID}>
                        <DivCourse>{detail.title}</DivCourse>
                        <DivTeacher>{detail.teacherName}</DivTeacher>
                        <DivCourse>課程作業</DivCourse>
                        {detail.allHomework.length === 0 ? (
                            <div>無資料</div>
                        ) : (
                            <>
                                <DivCourse>已完成</DivCourse>
                                {renderUploadedHomework(indexOfAllCourse)}
                                <DivCourse>未完成</DivCourse>
                                {renderNotUploadedHomework(indexOfAllCourse)}
                            </>
                        )}
                        <DivCourse>課程資料</DivCourse>
                        {detail.materials.length === 0 ? (
                            <div>無資料</div>
                        ) : (
                            detail.materials.map(material => (
                                <Div1 key={material.creatDate.seconds}>
                                    <DivContent>{material.title}</DivContent>

                                    <DivContent>
                                        {new Date(
                                            Math.floor(
                                                material.creatDate.seconds *
                                                    1000,
                                            ),
                                        ).toLocaleDateString()}
                                    </DivContent>

                                    <DivContent>
                                        <a href={material.fileURL}>點我下載</a>
                                    </DivContent>
                                </Div1>
                            ))
                        )}
                    </Div12>
                ))}
        </Container>
    );
};
