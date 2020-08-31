import React, {useState, useEffect, useRef} from "react";
import {UnorderedListOutlined} from "@ant-design/icons";
import "./style.css";
import {Link, withRouter, Redirect, useHistory} from "react-router-dom";
import {Menu, Dropdown, Button, Badge, Avatar, message, Alert, Modal} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../../redux/user";
import _ from "lodash";
import {userLogout} from "../../redux/auth";
// import logoMin from '../../assest/logo/IKEMEN.png';      //Logo "IKEMEN" only
import logoFull from "../../assest/logo/Ikemen_full.png"; //Logo "IKEMEN" with Home Health Service
import TextLoop from "react-text-loop";
import Notification from "../Notification";
import {countUnreadNotify} from "../../redux/notification";
import Portal from "../Portal/Portal";

import defaultRingtone from "../../assest/ringtone/HHS.wav";

const Navbar = props => {
    const {location} = props;
    const audioRef = useRef();

    const history = useHistory();
    // const [redirect, setRedirect] = useState(false);
    const [menu_class, setMenu_class] = useState("");
    const [drawerVisible, setdrawerVisible] = useState(false);
    const {unreadNotifyNumber, io} = useSelector(state => state.notify);
    const {currentUser} = useSelector(state => state.user);
    const {nonReadGroupNumber} = useSelector(state => state.chat);
    const {isLoad} = useSelector(state => state.ui);

    const auth = useSelector(state => state.auth);
    const {ringtone} = useSelector(state => state.call);

    const dispatch = useDispatch();

    const [openVideoCall, setOpenVideoCall] = useState(false);
    const [incomingCall, setIncomingCall] = useState(false);
    const [senderData, setSenderData] = useState(null);
    const [senderPeerID, setSenderPeerID] = useState(null);
    const [playRingtone, setPlayRingtone] = useState(false);

    const closeDrawer = () => {
        setdrawerVisible(false);
    };

    useEffect(() => {
        if (auth.token) {
            dispatch(getUser(auth?.token));
        }
    }, []);

    useEffect(() => {
        if (io) {
            //listen when someone call.
            io.on("connect-video-room", (getDoctorID, getSenderData) => {
                if (getDoctorID && !_.isEmpty(getSenderData)) {
                    setSenderData(getSenderData);
                    setSenderPeerID(getDoctorID);
                    setPlayRingtone(true);
                    setIncomingCall(true);
                }
            });
        }
    }, [currentUser, io]);

    // if (redirect) {
    //     return <Redirect to="/login" />;
    // }

    useEffect(() => {
        if (currentUser?.cusId) {
            const data = {receiver_id: currentUser?.cusId};
            dispatch(countUnreadNotify(data));
        }
    }, [currentUser]);

    useEffect(() => {
        if (playRingtone) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            audioRef.current.load();
        }
    }, [playRingtone]);

    const CustomLink = (to, name) => {
        return (
            <Link to={to} className={"top-menu-item " + (location.pathname === to ? "link-active" : "")}>
                {name}
            </Link>
        );
    };

    const setToggleTopMenuClass = () => {
        if (menu_class === "") {
            setMenu_class("toggled");
        } else {
            setMenu_class("");
        }
    };

    let top_menu_class = `top-menu ${menu_class}`;

    const toLoginPage = () => {
        props.history.push("/login");
    };

    const toBookingPage = () => {
        if (currentUser?.active) {
            props.history.push("/booking");
        } else {
            message.info("Tài khoản của bạn chưa được phê duyệt! Xin hãy kiên nhẫn hoặc liên hệ với chúng tôi để được giải đáp thêm.", 5);
        }
    };

    const handleUserMenuClick = e => {
        if (e.key === "logout") {
            if (io) {
            }
            dispatch(userLogout());
        } else if (e.key === "profile") {
            history.push("/profile");
        } else if (e.key === "notify") {
            setdrawerVisible(true);
        } else if (e.key === "messenger") {
            history.push("/messenger/t");
        }
    };

    const userMenu = (
        <Menu onClick={handleUserMenuClick}>
            <Menu.Item key="profile">Trang quản lý của tôi</Menu.Item>
            <Menu.Item key="notify">
                <span className="hightlight">{unreadNotifyNumber} </span>Thông báo mới
            </Menu.Item>
            <Menu.Item key="messenger">
                <span className="hightlight">{nonReadGroupNumber}</span> Tin nhắn
            </Menu.Item>
            <Menu.Item key="logout">Đăng xuất</Menu.Item>
        </Menu>
    );

    const renderAuth = auth.isLoggedIn ? (
        <div className="nav-user-div nav-userInfo">
            <Dropdown overlay={userMenu} className="nav-userInfo-user">
                <span className="nav-userInfo-user-name">
                    <span className="avatar-item">
                        <Badge count={unreadNotifyNumber} showZero>
                            <Avatar size="large" shape={"square"} src={currentUser?.avatarurl} />
                        </Badge>
                    </span>
                    {currentUser?.fullname}
                </span>
            </Dropdown>
            <button onClick={toBookingPage} className="fancyButton-background">
                Đặt lịch
            </button>
        </div>
    ) : (
        <button onClick={toLoginPage} className="fancyButton">
            Đăng nhập
        </button>
    );

    const delayLoopRingtone = () => {
        setTimeout(() => {
            audioRef.current.play();
        }, 2000);
    };

    const handleAcceptCall = () => {
        if (senderPeerID) {
            setOpenVideoCall(true);
        } else {
            message.destroy();
            message.error("Không thể kết nối với đối phương!", 4);
        }
        setPlayRingtone(false);
        setIncomingCall(false);
    };

    const handleCancelCall = () => {
        if (io && senderData) {
            io.emit("cancel-video", senderData?.id + "doctor");
            message.destroy();
            message.info("Đã từ chối cuộc gọi");
            setPlayRingtone(false);
            setIncomingCall(false);
            setSenderData(null);
            setSenderPeerID(null);
        }
    };

    const closeWindowPortal = () => {
        if (openVideoCall) {
            setOpenVideoCall(false);
            setIncomingCall(false);
            setSenderData(null);
            setSenderPeerID(null);
        }
    };

    window.onbeforeunload = e => {
        //cancel call if user reload page when a call is coming.
        if (incomingCall && io && senderData) {
            handleCancelCall();
        }
    };

    return (
        <div>
            <Notification visible={drawerVisible} closeDrawer={closeDrawer} />
            {openVideoCall && (
                <Portal
                    url={`${process.env.PUBLIC_URL}/call/video/${senderData?.id}?name=${senderData?.name}&avatar=${senderData?.avatar}&distract=${senderPeerID}`}
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
                    <Button key="accept" type="primary" loading={isLoad} onClick={() => handleAcceptCall()}>
                        Trả lời
                    </Button>,
                    <Button key="decline" onClick={() => handleCancelCall()} danger>
                        Từ chối
                    </Button>
                ]}
            >
                <div className="video-call-incoming">
                    <Avatar src={senderData?.avatar} alt={senderData?.name ?? "doctor_name"} size="large" type="circle flexible" />
                    <b>Bác sĩ {senderData?.name} gọi video cho bạn.</b>
                </div>
            </Modal>
            <div className={top_menu_class}>
                <Link to="/" className="top-menu-lead primary-color">
                    <div className="nav-logo">
                        <img alt="logo" src={logoFull} />
                    </div>
                </Link>
                <div className="right">
                    {CustomLink("/", "Trang chủ")}
                    {CustomLink("/service", "Các dịch vụ")}
                    {CustomLink("/doctors", "Bác sĩ")}
                    {CustomLink("/qa", "Hỏi đáp")}
                    {renderAuth}
                </div>
                <UnorderedListOutlined className="top-menu-icon" onClick={setToggleTopMenuClass} />
            </div>
            {auth.isLoggedIn && currentUser?.active === false && (
                <div className="nav-alert-banner">
                    <div className="nav-alert-controlled">
                        <Alert
                            message="Tài khoản của bạn chưa được phê duyệt!"
                            description={
                                <TextLoop mask delay={500} interval={10000}>
                                    <div>
                                        Tài khoản chưa phê duyệt sẽ không thể sử dụng dịch vụ. Xin hãy vào mục <Link to="/qa">Hỏi đáp</Link> để được
                                        giải đáp những câu hỏi.
                                    </div>
                                    <div>Xin hãy kiên nhẫn chờ Quản trị viên phê duyệt.</div>
                                    <div>Liên hệ với chúng tôi để được giải đáp thêm. Thông tin liên hệ ở cuối trang web.</div>
                                    <div>Cảm ơn bạn đã đăng kí sử dụng dịch vụ của chúng tôi!</div>
                                </TextLoop>
                            }
                            type="warning"
                            showIcon
                            banner
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default withRouter(Navbar);
