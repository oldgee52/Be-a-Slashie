export const useHandleValueChangeForDeepCopy = () => {
    function handleChangeForDeepCopy({
        data,
        targetName,
        dataKey,
        dataValue,
        callback,
    }) {
        const stateCopy = JSON.parse(JSON.stringify(data));
        stateCopy.forEach(courses => {
            courses.students.forEach(student => {
                if (targetName === `${courses.courseID}_${student.studentID}`)
                    student[dataKey] = dataValue;
            });
        });
        callback(stateCopy);
    }
    return handleChangeForDeepCopy;
};
