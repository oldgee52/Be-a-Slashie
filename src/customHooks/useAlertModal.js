import { useState } from "react";

const useAlertModal = () => {
    const [alertIsOpen, setAlertIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    function handleAlertModal(message) {
        setAlertIsOpen(true);
        setAlertMessage(message);
    }
    return [alertIsOpen, alertMessage, setAlertIsOpen, handleAlertModal];
};

export default useAlertModal;
