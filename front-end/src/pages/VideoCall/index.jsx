import React, {useState, useEffect, useLayoutEffect, useRef, createRef, forwardRef, useImperativeHandle} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Peer from "peerjs";

import {message, Tooltip} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

import {useCamera} from "./CustomHooks/useCamera";

import calling from "../../assest/image/call/call.png";
import endCall from "../../assest/image/call/call-disconnected.png";
import micOn from "../../assest/image/call/microphone.png";
import micOff from "../../assest/image/call/block-microphone.png";
import cameraOn from "../../assest/image/call/video-call.png";
import cameraOff from "../../assest/image/call/no-video.png";
// import audioOn from "../../assest/image/call/audio.png";
// import audioOff from "../../assest/image/call/mute.png";
import close from "../../assest/image/call/close.png";

import "./style.css";

const VideoCall = props => {
    const data = props.match?.params?.direct; //need avatar, name of doctor
    // const isCallLoad = useSelector(state => state.call.isCallLoad)

    // const history = useHistory();
    // const myFaceRef = createRef();
    const myFaceRef = createRef();
    const oppFaceRef = useRef(null);

    /**
     * This lib/component will open camera/mic and "streaming" by passing data through react ref into @video tag.
     *
     * @ignore *** isCameraInitialised, streaming, setStreaming ***
     *
     * @exports camera true/false: turn on/off webcam/camera
     * @exports micro true/false: turn on/off micro
     */
    const [getVideo, setVideo, camera, setCamera, micro, setMic, isCameraInitialised, streaming, setStreaming, errorStream] = useCamera(myFaceRef);

    const peer = new Peer(undefined, {
        host: process.env.REACT_APP_SERVER,
        port: 6969,
        path: "/peerjs"
    });

    const [peerControl, setPeerControl] = useState({});
    const [toggleAction, setToggleAction] = useState(true); //false: calling action, true: ended call action
    // const [toggleCam, setToggleCam] = useState(true); // false: turn off cam
    // const [toggleMic, setToggleMic] = useState(true);
    const [viewMyFace, setViewMyFace] = useState(false);
    const [isCallLoad, setIsCallLoad] = useState(true);

    const closeWindow = () => {
        window.close();
    };

    const viewAllFace = () => {
        setViewMyFace(!viewMyFace);
    };

    const toggleCamera = () => {
        if (camera) {
            setCamera(false);
            // setToggleCam(false);
        } else {
            setCamera(true);
            // setToggleCam(true);
        }
    };

    const toggleMicro = () => {
        // if (toggleMic) {
        if (micro) {
            setMic(false);
            // setToggleMic(false);
        } else {
            setMic(true);
            // setToggleMic(true);
        }
    };

    const actionCall = action => {
        switch (action) {
            case 0: //call again
                // history.replace("/");
                setToggleAction(true);
                // myFaceRef = createRef();
                setStreaming(true);
                break;
            case 1: //end call
                setToggleAction(false);
                // myFaceRef.current = null;
                setStreaming(false);
                break;

            default:
                break;
        }
    };

    //demo flow
    useEffect(() => {
        if (toggleAction) {
            setIsCallLoad(true);
            setTimeout(() => {
                setIsCallLoad(false);
            }, 2000);
        } else {
            if (isCallLoad) setIsCallLoad(false);
        }
    }, [toggleAction]);

    useEffect(() => {
        if (errorStream) message.error(errorStream, 3);
    }, [errorStream]);

    useEffect(() => {
        console.log(data);
        console.log(peer);
        setTimeout(() => {
            setIsCallLoad(false);
        }, 2000);
    }, []);

    return (
        <div className="video-call-wrapper">
            <div className="video-call-container">
                {toggleAction && !isCallLoad ? (
                    <>
                        <div ref={oppFaceRef} className="call-opposite-camera">
                            Doc Face
                        </div>
                        <div className={`call-my-camera ${viewMyFace ? "call-my-camera-full" : ""}`} onClick={() => viewAllFace()}>
                            {viewMyFace && (
                                <div className="call-hover-action">
                                    <div className="call-my-camera-action call-action-image call-action-close">
                                        <img src={close} alt="show-all-face" />
                                    </div>
                                    Thu nhỏ
                                </div>
                            )}
                            {!isCameraInitialised && (
                                <div>
                                    <LoadingOutlined /> Đang khởi tạo...
                                </div>
                            )}
                            <video ref={myFaceRef} id="myVideo" autoPlay />
                        </div>
                    </>
                ) : (
                    <div className="call-waiting">
                        Doctor avatar & name
                        {isCallLoad && (
                            <div>
                                <LoadingOutlined /> Đang gọi
                            </div>
                        )}
                    </div>
                )}
                <div className="call-action-bar">
                    {toggleAction ? (
                        <>
                            {camera ? (
                                <Tooltip title="Tắt Camera">
                                    <div className="call-action-image" onClick={() => toggleCamera()}>
                                        <img src={cameraOn} alt="call-camera" />
                                    </div>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Bật Camera">
                                    <div className="call-action-image call-action-close" onClick={() => toggleCamera()}>
                                        <img src={cameraOff} alt="call-camera" />
                                    </div>
                                </Tooltip>
                            )}
                            <Tooltip title="Kết thúc cuộc gọi" placement="top">
                                <div className="call-action-image call-action-off-image" onClick={() => actionCall(1)}>
                                    <img src={endCall} alt="end-call" />
                                </div>
                            </Tooltip>
                            <Tooltip title={(micro ? "Tắt" : "Bật") + " Micro"}>
                                <div className={`call-action-image ${micro ? "" : "call-action-close"}`} onClick={() => toggleMicro()}>
                                    <img src={micro ? micOn : micOff} alt="call-micro" />
                                </div>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Gọi lại">
                                <div className="call-action-image" onClick={() => actionCall(0)}>
                                    <img src={calling} alt="calling" />
                                </div>
                            </Tooltip>
                            <Tooltip title="Đóng">
                                <div className="call-action-image call-action-close" onClick={() => closeWindow()}>
                                    <img src={close} alt="closeWindow" />
                                </div>
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
