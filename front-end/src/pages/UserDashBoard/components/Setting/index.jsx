import React, {useState, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm, ErrorMessage} from "react-hook-form";
import {changePassword, getUserProfile, changeEmail, resetSettingStatus, subcribeEmail} from "../../../../redux/user";
import ChangePhone from "./components/ChangePhone";
import {Modal, Tooltip, Switch} from "antd";
import {LoadingOutlined, InfoCircleTwoTone} from "@ant-design/icons";

import "./style.css";

const Setting = () => {
    const {register, handleSubmit, watch, errors} = useForm({validateCriteriaMode: "all"});
    const password = useRef({});
    const old_password = useRef({});
    password.current = watch("password", "");
    old_password.current = watch("old_password", "");

    const dispatch = useDispatch();
    const {isLoad} = useSelector(state => state.ui);
    const userProfile = useSelector(state => state.user.userProfile);
    const {currentUser} = useSelector(state => state.user);
    const token = useSelector(state => state.auth.token);
    const settingStatus = useSelector(state => state.user.settingStatus);

    const [visiableEmail, setVisiableEmail] = useState(false);
    const [visiablePhoneModal, setVisiablePhoneModal] = useState(false);
    const [visiablePassword, setVisiablePassword] = useState(false);
    const [randColor, setRandColor] = useState(Math.floor(Math.random() * 6) + 1);

    const handleChangePassword = data => {
        let formPassword = {
            password: data.old_password,
            new_password: data.password,
            confirm_password: data.password_repeat
        };
        dispatch(changePassword(token, formPassword, currentUser?.customer_id));
    };

    const handleChangeEmail = data => {
        let formEmail = {
            email: data.email,
            password: data.verify_password
        };
        dispatch(changeEmail(token, formEmail, currentUser?.customer_id));
    };

    const handelSubcribeEmail = () => {
        let data = {mail_subscribe: currentUser?.mail_subscribe ? "false" : "true"};
        dispatch(subcribeEmail(data));
    };

    const handleCancelModal = () => {
        setVisiablePassword(false);
        setVisiablePhoneModal(false);
        setVisiableEmail(false);
    };

    useEffect(() => {
        if (settingStatus) {
            handleCancelModal();
            dispatch(resetSettingStatus());
        }
    }, [settingStatus]);

    useEffect(() => {
        if (userProfile === null || !userProfile) {
            if (currentUser?.customer_id) {
                dispatch(getUserProfile(currentUser?.customer_id, token));
            }
        }
    }, [userProfile]);

    return (
        <div className="setting-wrapper">
            <div className={"setting-cover setting-cover-" + randColor}></div>
            <div className="dashboard-component-header">Cài đặt</div>
            <div className="setting-content">
                <div className="setting-classify">
                    <div className="setting-content-header">Bảo mật</div>
                    <div className="setting-element">
                        <div className="setting-element-name">Email</div>
                        <div className="setting-element-value">
                            {userProfile?.email ? (
                                currentUser?.is_email_verified ? (
                                    userProfile?.email
                                ) : (
                                    <>
                                        {userProfile?.email} ­
                                        <Tooltip title="Email chưa xác thực">
                                            <InfoCircleTwoTone twoToneColor="#faad14" />
                                        </Tooltip>
                                    </>
                                )
                            ) : (
                                "Chưa liên kết"
                            )}
                        </div>
                        <div className="setting-element-action" onClick={() => setVisiableEmail(true)}>
                            Thay đổi
                        </div>
                        <Modal
                            centered
                            title={userProfile?.email ? "Thay đổi email" : "Thêm email"}
                            visible={visiableEmail}
                            destroyOnClose={true}
                            width={450}
                            footer={null}
                            onCancel={handleCancelModal}
                        >
                            <div className="setting-email">
                                <form onSubmit={handleSubmit(handleChangeEmail)}>
                                    <div className="profile-form-field">
                                        <p className="profile-form-label">Xác nhận mật khẩu</p>
                                        <input
                                            type="password"
                                            className="profile-form-input"
                                            name="verify_password"
                                            ref={register({
                                                required: "Bạn hãy điền password ",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password phải có ít nhất 6 kí tự "
                                                },
                                                maxLength: {
                                                    value: 14,
                                                    message: "Password nhiều nhất là 14 kí tự "
                                                }
                                            })}
                                        />
                                        <ErrorMessage errors={errors} name="verify_password">
                                            {({messages}) =>
                                                messages &&
                                                Object.entries(messages).map(([type, message]) => (
                                                    <span className="error-text" key={type}>
                                                        {message}
                                                    </span>
                                                ))
                                            }
                                        </ErrorMessage>

                                        <p className="profile-form-label">Email</p>
                                        <input
                                            type="email"
                                            className="profile-form-input"
                                            placeholder="___@___.___"
                                            name="email"
                                            defaultValue={userProfile?.email ?? ""}
                                            ref={register({
                                                pattern: {
                                                    value: /[\S+@\S+\.\S+]{6}/,
                                                    // /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
                                                    message: "Email không hợp lệ "
                                                }
                                            })}
                                        />
                                        <ErrorMessage errors={errors} name="email">
                                            {({messages}) =>
                                                messages &&
                                                Object.entries(messages).map(([type, message]) => (
                                                    <span className="error-text" key={type}>
                                                        {message}
                                                    </span>
                                                ))
                                            }
                                        </ErrorMessage>
                                    </div>
                                    <div className="setting-submit">
                                        <button disabled={isLoad} className={isLoad ? "upload-disable-button" : ""} type="submit">
                                            {isLoad ? <LoadingOutlined /> : ""} Cập nhật
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    </div>
                    <div className="setting-element">
                        <div className="setting-element-name">Số điện thoại</div>
                        <div className="setting-element-value">{userProfile?.phone ? userProfile.phone.replace(/84?/, "+84 ") : ""}</div>
                        <div className="setting-element-action" onClick={() => setVisiablePhoneModal(true)}>
                            Thay đổi
                        </div>
                        <Modal
                            centered
                            title="Đổi số điện thoại"
                            visible={visiablePhoneModal}
                            destroyOnClose={true}
                            width={600}
                            footer={null}
                            onCancel={handleCancelModal}
                        >
                            <ChangePhone />
                        </Modal>
                    </div>
                    <div className="setting-element">
                        <div className="setting-element-name">Mật khẩu</div>
                        <div className="setting-element-value"></div>
                        <div className="setting-element-action" onClick={() => setVisiablePassword(true)}>
                            Thay đổi
                        </div>
                        <Modal
                            centered
                            title="Đổi mật khẩu"
                            visible={visiablePassword}
                            destroyOnClose={true}
                            width={450}
                            footer={null}
                            onCancel={handleCancelModal}
                        >
                            <div className="setting-password">
                                <form onSubmit={handleSubmit(handleChangePassword)}>
                                    <div className="profile-form-field">
                                        <p className="profile-form-label">Mật khẩu hiện tại</p>
                                        <input
                                            type="password"
                                            className="profile-form-input"
                                            name="old_password"
                                            autoFocus
                                            ref={register({
                                                required: "Bạn hãy điền password ",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password phải có ít nhất 6 kí tự "
                                                },
                                                maxLength: {
                                                    value: 14,
                                                    message: "Password nhiều nhất là 14 kí tự "
                                                }
                                            })}
                                        />
                                        <ErrorMessage errors={errors} name="old_password">
                                            {({messages}) =>
                                                messages &&
                                                Object.entries(messages).map(([type, message]) => (
                                                    <span className="error-text" key={type}>
                                                        {message}
                                                    </span>
                                                ))
                                            }
                                        </ErrorMessage>

                                        <p className="profile-form-label">Mật khẩu mới</p>
                                        <input
                                            type="password"
                                            className="profile-form-input"
                                            name="password"
                                            ref={register({
                                                required: "Bạn hãy điền password ",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password phải có ít nhất 6 kí tự "
                                                },
                                                maxLength: {
                                                    value: 14,
                                                    message: "Password nhiều nhất là 14 kí tự "
                                                },
                                                validate: value => value !== old_password.current || "Mật khẩu mới giống hiện tại "
                                            })}
                                        />
                                        <ErrorMessage errors={errors} name="password">
                                            {({messages}) =>
                                                messages &&
                                                Object.entries(messages).map(([type, message]) => (
                                                    <span className="error-text" key={type}>
                                                        {message}
                                                    </span>
                                                ))
                                            }
                                        </ErrorMessage>

                                        <p className="profile-form-label">Nhập lại mật khẩu</p>
                                        <input
                                            name="password_repeat"
                                            className="profile-form-input"
                                            type="password"
                                            ref={register({
                                                // required: "Bạn hãy điền password ",
                                                validate: value => value === password.current || "Mật khẩu mới không khớp "
                                            })}
                                        />
                                        <ErrorMessage errors={errors} name="password_repeat">
                                            {({messages}) =>
                                                messages &&
                                                Object.entries(messages).map(([type, message]) => (
                                                    <span className="error-text" key={type}>
                                                        {message}
                                                    </span>
                                                ))
                                            }
                                        </ErrorMessage>
                                    </div>
                                    <div className="setting-submit">
                                        <button disabled={isLoad} className={isLoad ? "upload-disable-button" : ""} type="submit">
                                            {isLoad ? <LoadingOutlined /> : ""} Cập nhật
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    </div>
                </div>
                <div className="setting-classify">
                    <div className="setting-content-header">Nhận cập nhật</div>
                    <div className="setting-element">
                        <div className="setting-element-name">Email</div>
                        <div className="setting-element-value">{currentUser?.mail_subscribe ? "Đã" : "Chưa"} đăng kí</div>
                        <div className="setting-verify-email">
                            <Switch loading={isLoad} defaultChecked={currentUser?.mail_subscribe} onChange={() => handelSubcribeEmail()} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;
