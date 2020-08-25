import {useEffect, useState, useRef} from "react";
// import {isEmpty} from "lodash";

/**
 * @Caution Plz dont touch this cútom Hook, the changes may crash the app.
 *
 * This component will open camera & mic then "streaming" by exporting/passing 2 tracks channel (audio and video) to ref that corresponding to @param videoRef.
 * Besides, useCamera allow to set some specific state from outside for changing the streaming properties.
 */

const initialiseCamera = async () => await navigator.mediaDevices.getUserMedia({audio: true, video: true});

const useCleanup = val => {
    const valRef = useRef(val);

    useEffect(() => {
        valRef.current = val;
    }, [val]);

    useEffect(() => {
        //fired once on unmount
        return () => {
            // cleanup based on valRef.current
            if (valRef.current) valRef.current = null;
        };
    }, []);
};

export const useCamera = videoRef => {
    const [isCameraInitialised, setIsCameraInitialised] = useState(false);
    const [video, setVideo] = useState(null);
    const [error, setError] = useState("");
    const [streaming, setStreaming] = useState(true);
    const [camera, setCamera] = useState(true);
    const [mic, setMic] = useState(true);

    useEffect(() => {
        if (!videoRef.current) {
            setVideo(null);
            return;
        }

        if (video) {
            return;
        }
        console.log(videoRef);
        const videoElement = videoRef.current;

        //check if videoRef is a actual video element or not
        if (videoElement instanceof HTMLVideoElement) {
            console.log("sdvdf;k")
            setVideo(videoRef.current);
        }
    }, [videoRef, video]);

    useEffect(() => {
        if (!video || isCameraInitialised || !streaming) {
            return;
        }

        initialiseCamera()
            .then(stream => {
                video.srcObject = stream;
                video.addEventListener("loadedmetadata", () => {
                    // pretty useless tho
                    video.play();
                });
                setIsCameraInitialised(true);
                console.log("vào :/")
            })
            .catch(e => {
                setError(e.message);
                setStreaming(false);
            });
    }, [video, isCameraInitialised, streaming]);

    useEffect(() => {
        const getTrack = videoRef.current?.srcObject?.getTracks();
        // const videoElement = videoRef.current;

        if (!getTrack) {
            return;
        }

        if (camera) {
            getTrack[1].enabled = true; // [0]: audio channel, [1]: video channel
            // getTrack[1].readyState="live";
            // videoElement.play();
        } else {
            getTrack[1].enabled = false; // [0]: audio channel, [1]: video channel
            // getTrack[1].readyState="ended";
            // videoElement.pause();
        }
    }, [camera]);

    useEffect(() => {
        const getTrack = videoRef.current?.srcObject?.getTracks();

        if (!getTrack) {
            return;
        }

        if (mic) {
            getTrack[0].enabled = true;
        } else {
            getTrack[0].enabled = false;
        }
    }, [mic]);

    useCleanup(video);

    return [video, setVideo, camera, setCamera, mic, setMic, isCameraInitialised, streaming, setStreaming, error];
};
