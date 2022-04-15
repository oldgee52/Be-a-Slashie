import React, { useEffect } from "react";
import firebaseInit from "../utils/firebase";

export const StudentOpeningCourse = () => {
    useEffect(() => {
        const studentID = "WBKPGMSAejc9AHYGqROpDZWWTz23";

        firebaseInit
            .getStudentOpeningCourseDetails(studentID, 1)
            .then(data => console.log(data));
    }, []);

    return <div>StudentOpeningCourse</div>;
};
