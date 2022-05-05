import { useState } from "react";

export const useAlertModal = () => {
    const [alertIsOpen, setAlertIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    function handleAlertModal(message) {
        setAlertIsOpen(true);
        setAlertMessage(message);
    }
    return [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal];
};
