import { useEffect, useState } from "react";
import firebaseInit from "../utils/firebase";
import { collection } from "firebase/firestore";
export const useUserInfo = () => {
    const [usersInfo, setUsersInfo] = useState();

    useEffect(() => {
        let isMounted = true;
        firebaseInit
            .getCollection(collection(firebaseInit.db, "users"))
            .then(data => {
                console.log(data);
                if (isMounted) setUsersInfo(data);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    function findUserInfo(userID, infoType) {
        const result = usersInfo?.filter(array => array.uid === userID);
        return result && result[0][infoType];
    }
    return [findUserInfo, usersInfo];
};
