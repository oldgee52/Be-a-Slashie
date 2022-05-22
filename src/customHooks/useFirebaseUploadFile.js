import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import firebaseInit from "../utils/firebase";

export const useFirebaseUploadFile = () => {
    const [uploadIsLoading, setIsLoading] = useState(false);
    const uploadFile = async (fileName, file) => {
        if (!fileName) return;
        const mountainImagesRef = ref(
            firebaseInit.storage,
            `${+new Date()}file-${fileName}`,
        );

        setIsLoading(true);

        const uploadSnapshot = await uploadBytes(mountainImagesRef, file);
        const downloadURL = await getDownloadURL(uploadSnapshot.ref);
        console.log(downloadURL);

        setIsLoading(false);
        return downloadURL;
    };

    return [uploadIsLoading, uploadFile];
};
