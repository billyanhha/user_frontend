import React, {useState, useEffect, useLayoutEffect} from "react";
import {message} from "antd";

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
    const [toggleAction, setToggleAction] = useState(true); //false: calling action, true: ended call action
    const data = props.match?.params?.direct;

    const closeWindow = () => {
        window.close();
    };

    const actionCall = action => {
        switch (action) {
            case 0:     //call again
                setToggleAction(true);
                break;
            case 1:     //end call
                setToggleAction(false);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        console.log(data);
    }, []);

    return (
        <div className="video-call-wrapper">
            <div className="video-call-container">
                video call
                <div className="call-action-bar">
                    {toggleAction ? (
                        <>
                            <div className="call-action-image">
                                <img src={cameraOn} alt="cameraOn" />
                            </div>
                            <div className="call-action-image">
                                <img src={micOn} alt="micOn" />
                            </div>
                            <div className="call-action-image call-action-off-image" onClick={() => actionCall(1)}>
                                <img src={endCall} alt="endCall" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="call-action-image" onClick={() => actionCall(0)}>
                                <img src={calling} alt="calling" />
                            </div>
                            <div className="call-action-image call-action-close" onClick={() => closeWindow()}>
                                <img src={close} alt="closeWindow" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
