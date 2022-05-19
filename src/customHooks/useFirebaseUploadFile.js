import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebaseInit from "../utils/firebase";

export const useFirebaseUploadFile = () => {
    const [fileURL, setFileURL] = useState();
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [UploadIsLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // this function will be called when the any properties in the dependency array changes
    useEffect(() => {
        const uploadImage = () => {
            if (!fileName) return;
            const mountainImagesRef = ref(
                firebaseInit.storage,
                `${+new Date()}file-${fileName}`,
            );
            const uploadTask = uploadBytesResumable(mountainImagesRef, file);
            setIsLoading(true);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            console.log("default");
                    }
                },
                error => {
                    console.log(error);
                    setIsLoading(false);
                    setIsError(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        downloadURL => {
                            setFileURL(downloadURL);
                        },
                    );
                    setIsError(false);
                    setIsLoading(false);
                },
            );
        };
        file && uploadImage();
    }, [file]);

    return [{ fileURL, UploadIsLoading, isError }, setFile, setFileName];
};
