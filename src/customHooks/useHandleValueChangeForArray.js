export const useHandleValueChangeForArray = () => {
    function handleChange({
        data,
        indexOfFirstData,
        indexOfSecondData,
        dataKey,
        dataValue,
        callback,
    }) {
        let newData = [...data];
        indexOfSecondData === undefined && dataValue === undefined
            ? (newData[indexOfFirstData][dataKey] =
                  !newData[indexOfFirstData][dataKey])
            : indexOfSecondData === undefined
            ? (newData[indexOfFirstData][dataKey] = dataValue)
            : (newData[indexOfFirstData][indexOfSecondData][dataKey] =
                  dataValue);
        callback(newData);
    }
    return handleChange;
};
