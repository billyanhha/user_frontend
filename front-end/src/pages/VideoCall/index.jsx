import React, {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {message, Tooltip} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

import calling from "../../assest/image/call/call.png";
import endCall from "../../assest/image/call/call-disconnected.png";
import micOn from "../../assest/image/call/microphone.png";
import micOff from "../../assest/image/call/block-microphone.png";
import cameraOn from "../../assest/image/call/video-call.png";
import cameraOff from "../../assest/image/call/no-video.png";
import audioOn from "../../assest/image/call/audio.png";
import audioOff from "../../assest/image/call/mute.png";
import close from "../../assest/image/call/close.png";

import "./style.css";

const VideoCall = props => {
    const data = props.match?.params?.direct; //need avatar, name of doctor
    // const isCallLoad = useSelector(state => state.call.isCallLoad);

    const [toggleAction, setToggleAction] = useState(true); //false: calling action, true: ended call action
    const [toggleCam, setToggleCam] = useState(true);
    const [toggleMic, setToggleMic] = useState(true);
    const [viewMyFace, setViewMyFace] = useState(false);
    const [isCallLoad, setIsCallLoad] = useState(true);

    const closeWindow = () => {
        window.close();
    };

    const viewAllFace = () => {
        setViewMyFace(!viewMyFace);
    };

    const toggleCamera = () => {
        if (toggleCam) {
            //logic
            setToggleCam(false);
        } else {
            setToggleCam(true);
        }
    };

    const toggleMicro = () => {
        if (toggleMic) {
            //logic
            setToggleMic(false);
        } else {
            setToggleMic(true);
        }
    };

    const actionCall = action => {
        switch (action) {
            case 0: //call again
                setToggleAction(true);
                break;
            case 1: //end call
                setToggleAction(false);
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
        }
    }, [toggleAction]);

    useEffect(() => {
        console.log(data);
        setTimeout(() => {
            setIsCallLoad(false);
        }, 2000);
    }, []);

    return (
        <div className="video-call-wrapper">
            <div className="video-call-container">
                {toggleAction && !isCallLoad ? (
                    <>
                        <div className="call-opposite-camera">Doc Face</div>
                        <div className={`call-my-camera ${viewMyFace ? "call-my-camera-full" : ""}`} onClick={() => viewAllFace()}>
                            {viewMyFace ? (
                                <div className="call-hover-action">
                                    <div className="call-my-camera-action call-action-image call-action-close">
                                        <img src={close} alt="show-all-face" />
                                    </div>
                                    Thu nhỏ
                                </div>
                            ) : (
                                ""
                            )}
                            My pretty face
                        </div>
                    </>
                ) : (
                    <div className="call-waiting">
                        Doctor avatar & name
                        {isCallLoad ? (
                            <div>
                                <LoadingOutlined /> Đang gọi
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                )}
                <div className="call-action-bar">
                    {toggleAction ? (
                        <>
                            {toggleCam ? (
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
                            <Tooltip title={(toggleMic ? "Tắt" : "Bật") + " Micro"}>
                                <div className={`call-action-image ${toggleMic ? "" : "call-action-close"}`} onClick={() => toggleMicro()}>
                                    <img src={toggleMic ? micOn : micOff} alt="call-micro" />
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
