export const useHandleValueChangeForObject = () => {
    function handleChange(data, dataKey, dataValue, callback) {
        let newData = { ...data };
        newData[dataKey] = dataValue;
        callback(newData);
    }
    return handleChange;
};
