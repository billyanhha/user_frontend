import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import _ from "lodash";
import {notification, Button, Modal, Tooltip, message, Badge, Avatar} from "antd";
import {SoundOutlined} from "@ant-design/icons";

import {withRouter} from "react-router-dom";
import io from "socket.io-client";
import {saveIoInstance, clearIoInstance, countUnreadNotify, markReadNotify, getUserNotification} from "../../redux/notification";
import {setCallStatus, setOpponentData, setOpenVideoCall} from "../../redux/call";

import Portal from "../Portal/Portal";
import defaultRingtone from "../../assest/ringtone/HHS.wav";

const Notify = props => {
    const audioRef = useRef();

    const notify = useSelector(state => state.notify);
    const user = useSelector(state => state.user);
    const {token} = useSelector(state => state.auth);
    const {ringtone} = useSelector(state => state.ringtone);
    const {openVideoCall, opponentData} = useSelector(state => state.call);
    const {isLoad} = useSelector(state => state.ui);

    const dispatch = useDispatch();
    const [incomingCall, setIncomingCall] = useState(false);
    const [senderPeerID, setSenderPeerID] = useState(null);
    const [playRingtone, setPlayRingtone] = useState(false);

    useEffect(() => {
        if (_.isEmpty(token)) {
            dispatch(clearIoInstance());
        }
    }, [token]);

    useEffect(() => {
        if (_.isEmpty(notify?.io) && !_.isEmpty(user?.currentUser)) {
            const ioConnectData = io(process.env.REACT_APP_SERVER);
            dispatch(saveIoInstance(ioConnectData));
            ioConnectData.emit("client-send-userId", user?.currentUser?.cusId + "customer");
        }
    }, [user?.currentUser]);

    const markReadNotifyFunc = value => {
        if (!value?.is_read) {
            const data = {id: value?.id, is_read: true};
            dispatch(markReadNotify(data));
        }
        window.location.href = value?.url;
    };

    const notifyPanel = data => {
        if (!_.isEmpty(data)) {
            const btn = (
                <Button type="link" onClick={() => markReadNotifyFunc(data)}>
                    Chi tiết
                </Button>
            );
            notification["info"]({
                key: data?.id,
                message: "Thông báo",
                description: data?.content,
                btn,
                duration: 0,
                placement: "bottomLeft"
            });
        }
    };

    const getMessage = () => {
        if (notify?.io) {
            notify.io.on("server-send-notification", data => {
                getNewNotify();
                getNotifyNum();
                notifyPanel(data);
            });
        }
    };

    const getNewNotify = () => {
        if (user?.currentUser?.cusId) {
            const data = {id: user?.currentUser?.cusId, itemsPage: 30, page: 1};
            dispatch(getUserNotification(data));
        }
    };

    const getNotifyNum = () => {
        if (user?.currentUser?.cusId) {
            const data = {receiver_id: user?.currentUser?.cusId};
            dispatch(countUnreadNotify(data));
        }
    };

    const delayLoopRingtone = () => {
        setTimeout(() => {
            audioRef.current.play();
        }, 2000);
    };

    const handleAcceptCall = () => {
        if (senderPeerID) {
            dispatch(setCallStatus(true));
            dispatch(setOpenVideoCall(true));
        } else {
            message.destroy();
            message.error("Không thể kết nối với đối phương!", 4);
        }
        setPlayRingtone(false);
        setIncomingCall(false);
    };

    const handleCancelCall = type => {
        message.destroy();
        if (type !== null) {
            message.info("Bác sĩ đã huỷ cuộc gọi", 4);
        } else {
            if (notify?.io && opponentData) {
                notify.io.emit("cancel-video", opponentData?.id + "doctor");
                message.info("Đã từ chối cuộc gọi");
            }
        }
        setPlayRingtone(false);
        setIncomingCall(false);
        dispatch(setOpponentData(null));
        setSenderPeerID(null);
    };

    const closeWindowPortal = () => {
        if (openVideoCall) {
            if (notify?.io && opponentData){
                notify.io.emit("cancel-video", opponentData?.id + "doctor");
            }
            dispatch(setOpenVideoCall(false));
            dispatch(setOpponentData(null));
            dispatch(setCallStatus(false));
            setIncomingCall(false);
            setSenderPeerID(null);
        }
    };

    useEffect(() => {
        if (notify?.io) {
            //listen when someone call.
            notify.io.on("connect-video-room", (getDoctorID, getSenderData) => {
                if (getDoctorID && !_.isEmpty(getSenderData)) {
                    dispatch(setOpponentData(getSenderData));
                    setSenderPeerID(getDoctorID);
                    setPlayRingtone(true);
                    setIncomingCall(true);
                }
            });

            notify.io.on("caller-cancel-call", () => {
                handleCancelCall(1);
            });
        }
    }, [user?.currentUser, notify?.io]);

    useEffect(() => {
        if (_.isEmpty(audioRef.current)) return;

        if (playRingtone) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            audioRef.current.load();
        }
    }, [playRingtone]);

    window.addEventListener("beforeunload", event => {
        //cancel call if user reload page when a call is coming.
        if (incomingCall && io && opponentData) {
            handleCancelCall(null);
        }
    });

    return !_.isEmpty(token) && !props.location.pathname.includes("/call/") ? (
        <div>
            {openVideoCall && (
                <Portal
                    url={`${process.env.PUBLIC_URL}/call/video/${opponentData?.id}?name=${opponentData?.name}&avatar=${opponentData?.avatar}${
                        senderPeerID ? "&distract=" + senderPeerID : ""
                    }`}
                    closeWindowPortal={closeWindowPortal}
                />
            )}
            <audio
                ref={audioRef}
                src={ringtone ? "../../assest/ringtone/HHS.wav" + ringtone : defaultRingtone}
                // loop
                onEnded={delayLoopRingtone}
                style={{display: "none"}}
            />
            <Modal
                title="Cuộc gọi đến"
                visible={incomingCall}
                style={{top: 20}}
                width={450}
                closable={false}
                footer={[
                    <Tooltip title="Đổi nhạc chuông trong Cài đặt" placement="bottom" getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <SoundOutlined style={{color: "#00BC9A"}} /> ­ <Badge status="processing" color="#00BC9A" />
                    </Tooltip>,
                    <Button
                        key="accept"
                        type="primary"
                        loading={isLoad}
                        onClick={() => handleAcceptCall()}
                        style={{backgroundColor: "#00BC9A", borderColor: "#00BC9A", marginLeft: "20px"}}
                    >
                        Trả lời
                    </Button>,
                    <Button key="decline" onClick={() => handleCancelCall(null)} danger>
                        Từ chối
                    </Button>
                ]}
            >
                <div className="video-call-incoming">
                    <Avatar src={opponentData?.avatar} alt={opponentData?.name ?? "doctor_name"} size="large" type="circle flexible" />
                    <b>Bác sĩ {opponentData?.name} gọi video cho bạn.</b>
                </div>
            </Modal>
            {getMessage()}
        </div>
    ) : (
        ""
    );
};

export default withRouter(Notify);
