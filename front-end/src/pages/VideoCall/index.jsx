import React, {useState, useEffect, useLayoutEffect, useRef, createRef, forwardRef, useImperativeHandle} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, withRouter} from "react-router-dom";
import Peer from "peerjs";

import {message, Tooltip, Avatar} from "antd";
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
import {isEmpty} from "lodash";

const VideoCall = props => {
    const receiverID = props.match?.params?.direct;
    /**
     * @param distract = null → NOT an incomming call
     * Detect as an incomming call → @conclusion all param = null (distract, name, avatar)
     */
    const params = new URLSearchParams(props.location.search);
    const senderPeerID = params.get("distract"); //null: this call is a call away (NOT an incomming call).

    // const isCallLoad = useSelector(state => state.call.isCallLoad)
    const {io} = useSelector(state => state.notify);
    const {currentUser} = useSelector(state => state.user);

    // const history = useHistory();
    const myFaceRef = createRef();
    const oppFaceRef = createRef();
    // const oppFaceRef = useRef(null);

    /**
     * This lib/component will open camera/mic and "streaming" by passing data through react ref into @video tag.
     *
     * @ignore *** isCameraInitialised, streaming, setStreaming ***
     *
     * @exports camera true/false: turn on/off webcam/camera
     * @exports micro true/false: turn on/off micro
     */
    const [
        myStreamData,
        setMyStreamData,
        getVideo,
        setVideo,
        camera,
        setCamera,
        micro,
        setMic,
        isCameraInitialised,
        streaming,
        setStreaming,
        errorStream
    ] = useCamera(myFaceRef, null);
    const [
        docStreamData,
        setDocStreamData,
        getVideoDoc,
        setVideoDoc,
        cameraDoc,
        setCameraDoc,
        microDoc,
        setMicDoc,
        isCameraInitialisedDoc,
        streamingDoc,
        setStreamingDoc,
        errorStreamDoc
    ] = useCamera(oppFaceRef, 1);

    const peer = new Peer(undefined, {
        host: "ikemen-api.herokuapp.com",
        secure: true,
        port: 443,
        path: "/peerjs"
    });

    // const peer = new Peer({host: "peerjs-server.herokuapp.com", secure: true, port: 443});

    peer.on("call", call => {
        console.log("nhận call");
        call.answer(myStreamData);
        call.on("stream", senderVideoStream => {
            setDocStreamData(senderVideoStream);
        });
    });
    
    peer.on("error", err => {
        message.info(err.message);
    });

    const [peerID, setPeerID] = useState(null);
    const [peerControl, setPeerControl] = useState({});
    const [toggleAction, setToggleAction] = useState(true); //false: calling action, true: ended call action
    const [viewMyFace, setViewMyFace] = useState(false);
    const [isCallLoad, setIsCallLoad] = useState(true);

    const [oppositeData, setOppositeData] = useState(null);
    const [oppositePeerID, setOppositePeerID] = useState(null);

    const getOppositeName = () => {
        return params.get("name");
    };

    const getOppositeAvatar = () => {
        return params.get("avatar");
    };

    //when answer call, make a call back to doctor by using mypeer.call
    const connectToNewUser = senderPeerId => {
        // Nhận other peerID → call peerID đó
        console.log("bắt đầu call đến doctor");
        console.log("doctorPeerID: === " + senderPeerId);
        console.log("cusStreamData:");
        console.log(myStreamData);
        const call = peer.call(senderPeerId, myStreamData);

        // Check other trả lời → nhận stream → show video
        //listen when doctor answer back, and get his stream
        console.log("nhận stream");
        call.on("stream", senderVideoStream => {
            console.log("----------get customer stream");
            console.log(senderVideoStream);
            setDocStreamData(senderVideoStream);
        });
    };

    const closeWindow = () => {
        window.close();
    };

    const viewAllFace = () => {
        setViewMyFace(!viewMyFace);
    };

    const toggleCamera = () => {
        setCamera(!camera);
    };

    const toggleMicro = () => {
        setMic(!micro);
    };

    const handleSocket = () => {
        /**
         *  @param event
         *  @param receiverID
         *  @param peerID of sender
         */
        let senderData = {name: currentUser?.fullname, avatar: currentUser?.avatarurl};
        io.emit("video-connect", senderData, receiverID + "doctor", peerID);

        io.on("connect-video-room-offline", data => {
            if (data === true) {
                message.info("Bác sĩ không trực tuyến, xin hãy gọi lại sau!", 4);
            }
        });

        // Listen event other disconnected
        io.on("user-disconnected", userId => {
            message.info("Đối phương đã ngắt kết nối!" + userId, 4);
        });

        io.on("connect-video-room", (getSenderPeerID, getSenderData) => {
            console.log("có hồi đáp từ socket");
            console.log(getSenderPeerID);
            console.log(getSenderData);
            if (getSenderPeerID && !isEmpty(getSenderData)) {
                setOppositeData(getSenderData);
                setOppositePeerID(getSenderPeerID);
            }
        });
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
                closeWindow();
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
        //only (senderPeerID != null/false) mean: → only incomming call will trigger this func
        if (!senderPeerID) return;
        /**
         * @require myStreamData had to ready first (an MediaStream Object)
         */

        console.log("senderPeerID" + senderPeerID);

        console.log("test status my cam" + isCameraInitialised);
        console.log("test status opp cam" + isCameraInitialisedDoc);
        if (isCameraInitialised && !isCameraInitialisedDoc) {
            //wait until streaming data on doctor side is ready!
            connectToNewUser(senderPeerID);
        }
    }, [isCameraInitialised, isCameraInitialisedDoc, senderPeerID]);

    // useEffect(() => {
    //     console.log(myStreamData);
    //     console.log(docStreamData);
    // }, [myStreamData, docStreamData]);

    useEffect(() => {
        if (errorStream) message.error(errorStream, 3);
    }, [errorStream]);

    useEffect(() => {
        if (io && peerID && currentUser?.cusId) {
            console.log("cusPeerID", peerID);
            handleSocket();
        }
    }, [io, peerID, currentUser]);

    // useEffect(() => {
    //     if (oppositePeerID) {
    //         console.log("Gọi đến doctor ");
    //         console.log(oppositePeerID);
    //         connectToNewUser(oppositePeerID); //check if myStreamData null / {}
    //     }
    // }, [oppositePeerID, myStreamData]);

    // useEffect(() => {
    //     if (peer && peerID && !isEmpty(myStreamData)) {
    //         //listen other peer call back, auto answer and create his video stream
    //         peer.on("call", call => {
    //             console.log("nhận call");
    //             call.answer(myStreamData);
    //             call.on("stream", senderVideoStream => {
    //                 setDocStreamData(senderVideoStream);
    //             });
    //         });
    //     }
    // }, [peer, myStreamData, peerID]);

    useEffect(() => {
        peer.on("open", id => {
            setPeerID(id);
        });

        peer.on("call", call => {
            console.log("nhận call");
            call.answer(myStreamData);
            call.on("stream", senderVideoStream => {
                setDocStreamData(senderVideoStream);
            });
        });
    }, []);

    return (
        <div className="video-call-wrapper">
            <div className="video-call-container">
                {toggleAction && !isCallLoad ? (
                    <>
                        <div className="call-opposite-camera">
                            {!isCameraInitialisedDoc && (
                                <div>
                                    <LoadingOutlined /> Đang kết nối...
                                </div>
                            )}
                            <video ref={oppFaceRef} id="oppVideo" autoPlay />
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
                        <Avatar src={getOppositeAvatar()} alt={getOppositeName()} size="large" type="circle flexible" />
                        {getOppositeName()}
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

export default withRouter(VideoCall);
