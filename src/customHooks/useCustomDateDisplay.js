export const useCustomDateDisplay = () => {
    function customDateDisplay(date) {
        const displayYear = new Date(date).getFullYear();
        const primaryMonth = Number(new Date(date).getMonth() + 1);
        const displayMonth =
            primaryMonth < 10 ? `0${primaryMonth}` : primaryMonth;
        const primaryDate = new Date(date).getDate();
        const displayDate = primaryDate < 10 ? `0${primaryDate}` : primaryDate;
        return displayYear + "." + displayMonth + "." + displayDate;
    }
    return customDateDisplay;
};
