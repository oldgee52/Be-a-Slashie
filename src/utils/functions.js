export const customDateDisplay = date => {
    const displayYear = new Date(date).getFullYear();
    const primaryMonth = Number(new Date(date).getMonth() + 1);
    const displayMonth = primaryMonth < 10 ? `0${primaryMonth}` : primaryMonth;
    const primaryDate = new Date(date).getDate();
    const displayDate = primaryDate < 10 ? `0${primaryDate}` : primaryDate;
    return `${displayYear}.${displayMonth}.${displayDate}`;
};

export const handleChangeForObject = (data, dataKey, dataValue, callback) => {
    if (Object.prototype.toString.call(data) !== "[object Object]") return;
    const newData = { ...data };
    newData[dataKey] = dataValue;
    callback(newData);
};

export const handleChangeChangeForArray = ({
    data,
    indexOfFirstData,
    indexOfSecondData,
    dataKey,
    dataValue,
    callback,
}) => {
    const newData = [...data];
    if (indexOfSecondData === undefined && dataValue === undefined) {
        newData[indexOfFirstData][dataKey] =
            !newData[indexOfFirstData][dataKey];
        return callback(newData);
    }
    if (indexOfSecondData === undefined) {
        newData[indexOfFirstData][dataKey] = dataValue;
        return callback(newData);
    }
    newData[indexOfFirstData][indexOfSecondData][dataKey] = dataValue;

    return callback(newData);
};

export const handleChangeForDeepCopy = ({
    data,
    targetName,
    dataKey,
    dataValue,
    callback,
}) => {
    const stateCopy = JSON.parse(JSON.stringify(data));
    stateCopy.forEach(courses => {
        courses.students.forEach(student => {
            const studentData = student;
            if (targetName === `${courses.courseID}_${studentData.studentID}`)
                studentData[dataKey] = dataValue;
        });
    });
    callback(stateCopy);
};

export const getTheSameTitleArray = (array1, array2) => {
    return array1.filter(object1 => {
        return array2.some(object2 => {
            if (!object1.title || !object2.title) return false;
            return object1.title === object2.title;
        });
    });
};

export const getNotMatchTitleArray = (array1, array2) => {
    return array1.filter(object1 => {
        return !array2.some(object2 => {
            return object1.title === object2.title;
        });
    });
};

export const findUniqueOutcomeWithUid = array => {
    return array.filter((item, index, self) => {
        if (!item.uid) return false;
        return index !== self.findIndex(t => t.uid === item.uid);
    });
};
