import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import firebaseInit from "../utils/firebase";

const useFirebaseUploadFile = () => {
    const [uploadIsLoading, setIsLoading] = useState(false);
    async function uploadFile(fileName, file) {
        if (!fileName) return null;
        const mountainImagesRef = ref(
            firebaseInit.storage,
            `${+new Date()}file-${fileName}`,
        );

        setIsLoading(true);

        const uploadSnapshot = await uploadBytes(mountainImagesRef, file);
        const downloadURL = await getDownloadURL(uploadSnapshot.ref);

        setIsLoading(false);

        return downloadURL;
    }

    return [uploadIsLoading, uploadFile];
};

export default useFirebaseUploadFile;
