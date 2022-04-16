import React, { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import styled from "styled-components";

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
    const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";
    useEffect(() => {
        firebaseInit.getStudentOpeningCourseDetails(studentID, 1).then(data => {
            setCourseDetails(data);
            console.log(data);
        });
    }, []);

    // const handleUploadHomework = () => {};
    // const handleFileChange = e => {};
    // const renderHomework = () => {
    //     const allHomework = courseDetails.map(detail => detail.allHomework);
    //     const myHomework = courseDetails.map(detail => detail.myHomework);

    //     console.log(myHomework[0]);
    //     console.log(allHomework[0]);

    //     const res2 = myHomework[0].filter(
    //        page1 => allHomework[0].find(page2 => page1.title === page2.title),
    //     );
    //     console.log(res2);
    // };

    // const handleFileChange = e => {
    //     const stateCopy = JSON.parse(JSON.stringify(courseDetails));
    //     stateCopy.forEach(courses => {
    //         courses.myHomework.forEach(homework => {
    //             if (e.target.name === `${homework.title}_${courses.courseID}`) {
    //                 homework.file = e.target.files[0];
    //             }
    //         });
    //     });

    //     setCourseDetails(stateCopy);
    //     console.log(stateCopy);
    // };
    /*
    const handleUploadHomework = e => {
        const stateCopy = JSON.parse(JSON.stringify(courseDetails));
        stateCopy.forEach(courses => {
            courses.myHomework.forEach(homework => {
                if (e.target.id === `${homework.title}_${courses.courseID}`) {
                    // const mountainImagesRef = ref(
                    //     firebaseInit.storage,
                    //     `${homework.title}_${courses.courseID}`,
                    // );
                    // const uploadTask = uploadBytesResumable(
                    //     mountainImagesRef,
                    //     homework.file,
                    // );

                    // uploadTask.on(
                    //     "state_changed",
                    //     snapshot => {
                    //         const progress =
                    //             (snapshot.bytesTransferred /
                    //                 snapshot.totalBytes) *
                    //             100;
                    //         console.log("Upload is " + progress + "% done");
                    //         switch (snapshot.state) {
                    //             case "paused":
                    //                 console.log("Upload is paused");
                    //                 break;
                    //             case "running":
                    //                 console.log("Upload is running");
                    //                 break;
                    //             default:
                    //                 console.log("default");
                    //         }
                    //     },
                    //     error => {
                    //         console.log(error);
                    //     },
                    //     () => {
                    //         getDownloadURL(uploadTask.snapshot.ref).then(
                    //             async downloadURL => {
                    //                 try {
                    //                     await updateDoc(
                    //                         doc(
                    //                             firebaseInit.db,
                    //                             "courses",
                    //                             courses.courseID,
                    //                             "students",
                    //                             studentID,
                    //                         ),
                    //                         {
                    //                             homework: {
                    //                                 ...homework,
                    //                                 fileURL: downloadURL,
                    //                             },
                    //                         },
                    //                     );

                                        homework.fileURL = downloadURL;
                                        return window.alert(
                                            "上傳教材成功囉!!!",
                                        );
                                    // } catch (error) {
                                    //     window.alert("上傳教材失敗");
                                    //     console.log(error);
                                    // }
                                // },
                            // );
                        // },
                    // );
                }
            });
        });

        setCourseDetails(stateCopy);
        console.log(stateCopy);
    };*/

    return (
        <Container>
            {courseDetails &&
                courseDetails.map(detail => (
                    <Div12 key={detail.courseID}>
                        <DivCourse>{detail.title}</DivCourse>
                        <DivTeacher>{detail.teacherName}</DivTeacher>
                        <DivCourse>課程作業</DivCourse>

                        {detail.allHomework.length === 0 ? (
                            <div>無資料</div>
                        ) : (
                            detail.allHomework.map(homework => (
                                <Div1 key={homework.title}>
                                    {homework.title}
                                    <Input
                                        type="file"
                                        name={`${homework.title}_${detail.courseID}`}
                                        // onChange={e => handleFileChange(e)}
                                    />

                                    <button
                                        id={`${homework.title}_${detail.courseID}`}
                                        // onClick={e => handleUploadHomework(e)}
                                    >
                                        點我上傳
                                    </button>
                                </Div1>
                            ))
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