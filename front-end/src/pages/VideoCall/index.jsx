import React, {useState, useEffect, createRef} from "react";
import {useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
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

const VideoCall = props => {
    const receiverID = props.match?.params?.direct;
    /**
     * @param distract = null → NOT an incomming call
     * Detect as an incomming call → @conclusion all param = null (distract, name, avatar)
     */
    const params = new URLSearchParams(props.location.search);
    const senderPeerID = params.get("distract"); //null: this call is a call away (NOT an incomming call).

    const {io} = useSelector(state => state.notify);
    const {currentUser} = useSelector(state => state.user);

    // const history = useHistory();
    const myFaceRef = createRef();
    const oppFaceRef = createRef();
    // const oppFaceRef = useRef(null);

    /**
     * ================================================================================================
     *      WARNING: DO NOT edit or change the order of the variable/states on useCamera and below
     * ================================================================================================
     *
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
    ] = useCamera(myFaceRef);

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
    ] = useCamera(oppFaceRef);

    // const peer = new Peer(undefined, {
    //     host: "ikemen-api.herokuapp.com",
    //     secure: true,
    //     port: 443,
    //     path: "/peerjs"
    // });

    const peer = new Peer({host: "peerjs-server.herokuapp.com", secure: true, port: 443});

    peer.on("error", err => {
        message.info(err.message);
    });

    const [peerID, setPeerID] = useState(null);
    const [toggleAction, setToggleAction] = useState(true); //true: calling || call again, false: end call
    const [viewMyFace, setViewMyFace] = useState(false);
    const [isCallLoad, setIsCallLoad] = useState(true);
    const [isDisconnected, setIsDisconnected] = useState(false);

    const getOppositeName = () => {
        return params.get("name");
    };

    const getOppositeAvatar = () => {
        return params.get("avatar");
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

    /**
     *  This function is @ignored when it is an incomming call.
     */
    const requestSocketNewCall = () => {
        if (!senderPeerID) {
            /**
             *  @param event
             *  @param receiverID = doctorID
             *  @param peerID of customer
             */
            let senderData = {id: currentUser?.cusId, name: currentUser?.fullname, avatar: currentUser?.avatarurl};
            io.emit("video-connect", senderData, receiverID + "doctor", peerID);
        }
    };

    const handleSocket = () => {
        requestSocketNewCall();

        io.on("cancel-video", () => {
            message.destroy();
            message.info("Bác sĩ đã huỷ cuộc gọi, cửa sổ này sẽ tự động đóng sau 5 giây!", 5);
            setToggleAction(false);
            setTimeout(() => {
                closeWindow();
            }, 5000);
        });

        io.on("connect-video-room-offline", data => {
            console.log("-video-room-offline", data);

            if (data === true) {
                setIsCallLoad(false);
                setIsDisconnected(true);
                message.info("Bác sĩ không trực tuyến, xin hãy gọi lại sau!", 4);
            }
        });

        // Listen event other disconnected
        io.on("user-disconnected", userId => {
            setIsDisconnected(true);
            message.info("Đối phương đã ngắt kết nối!", 4);
        });
    };

    const actionCall = action => {
        switch (action) {
            case 0: //call again
                // history.replace("/");
                setToggleAction(true);
                // myFaceRef = createRef();
                // setStreaming(true);
                break;
            case 1: //end call
                if (io) {
                    io.emit("cancel-video", receiverID + "customer");
                }
                closeWindow();
                setToggleAction(false);

                // myFaceRef.current = null;
                // setStreaming(false);
                break;

            default:
                break;
        }
    };

    /**
     * this func trigger if doctor requests a call to customer.
     * @description Make a peer call to doctor
     *
     */
    const handlePeerCallDoctor = senderPeerId => {
        //thử async call
        const call = peer.call(senderPeerId, myStreamData);

        //listen if connect peer to doctor successful (response), and get his/her stream
        call.on("stream", senderVideoStream => {
            setDocStreamData(senderVideoStream);
        });
    };

    useEffect(() => {
        //only (senderPeerID != null/false) mean: → only incomming call will trigger this func
        if (!senderPeerID) return;

        /**
         * @require myStreamData had to ready first (an MediaStream Object)
         */
        if (peerID && isCameraInitialised && !isCameraInitialisedDoc) {
            //wait until streaming data on doctor side is ready!
            console.log("countdown 9s");
            setIsCallLoad(false);
            setTimeout(() => {
                handlePeerCallDoctor(senderPeerID);
            }, 9000);
        }
    }, [peerID, isCameraInitialised, isCameraInitialisedDoc]);

    useEffect(() => {
        if (toggleAction) {
            //call again
            setIsCallLoad(true);
        } else {
            //end call
            if (isCallLoad) setIsCallLoad(false);
        }
    }, [toggleAction]);

    useEffect(() => {
        message.destroy();
        if (errorStream) message.error(errorStream, 3);
        if (errorStreamDoc) message.error(errorStreamDoc, 3);
    }, [errorStream, errorStreamDoc]);

    useEffect(() => {
        if (io && peerID && currentUser?.cusId) {
            handleSocket();
        }
    }, [io, peerID, currentUser]);

    useEffect(() => {
        let streamInit;

        peer.on("open", id => {
            setPeerID(id);
        });

        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
            setMyStreamData(stream);
            streamInit = stream;
        });

        if (!senderPeerID) {
            //senderPeerID = null if Doctor requests a call to Doctor (to socket)

            peer.on("call", call => {
                call.answer(streamInit);
                call.on("stream", senderVideoStream => {
                    setDocStreamData(senderVideoStream);
                });
                if (isCallLoad) setIsCallLoad(false);
            });
        }
    }, []);

    return (
        <div className="video-call-wrapper">
            <div className="video-call-container">
                {toggleAction ? (
                    <>
                        <div className="call-opposite-camera">
                            <div className="call-opposite-info">
                                <Avatar src={getOppositeAvatar()} alt={getOppositeName()} size="large" type="circle flexible" />
                                <b>{getOppositeName()}</b>
                            </div>
                            {isCallLoad ? (
                                <div>
                                    <LoadingOutlined /> Đang gọi
                                </div>
                            ) : (
                                !isCameraInitialisedDoc &&
                                !isDisconnected && (
                                    <div>
                                        <LoadingOutlined /> Đang kết nối...
                                    </div>
                                )
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
                    <div className="call-waiting">Cuộc gọi đã kết thúc!</div>
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
                            {/* <Tooltip title="Gọi lại">
                                <div className="call-action-image" onClick={() => actionCall(0)}>
                                    <img src={calling} alt="calling" />
                                </div>
                            </Tooltip> */}
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
