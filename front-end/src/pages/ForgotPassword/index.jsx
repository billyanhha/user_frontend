import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import { forgotPasswordSendPhone, forgotPasswordSendOTP, forgotPasswordSetStep, forgotPasswordCancel, resetPassword } from '../../redux/auth';
import InputMask from 'react-input-mask';
import Countdown from 'react-countdown';
import { Spin, Steps, Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Navbar from '../../components/Navbar';

import "./style.css";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { Step } = Steps;
    const { register, handleSubmit, watch, errors, control } = useForm({ validateCriteriaMode: "all" });
    const { isLoad } = useSelector(state => state.ui);
    const currentStep = useSelector(state => state.auth.stepRecoverPassword);
    const isSuccessful = useSelector(state => state.auth.isResetPasswordSuccess);
    const otpID = useSelector(state => state.auth.otpID);
    const timeOutSaved = useSelector(state => state.auth.savedTimeOut);     //moment that request to send phone num api successfully

    const password = useRef({});
    password.current = watch("password", "");
    
    //Each render → Compare time now with "timeOutSaved" state, if still have time to countdown then countdown.
    let startCountdown = timeOutSaved > Date.now() ? true : false;

    const handleRequestOTP = (data) => {
        dispatch(forgotPasswordSendPhone(data.phone.replace(/\s+/g, '').substring(1)));
    }

    const handleVerifyOTP = (data) => {
        if (otpID) {
            dispatch(forgotPasswordSendOTP(otpID, data.otp));
        }
    }

    const handleResetPassword = (data) => {
        if (otpID)
            dispatch(resetPassword(otpID, data.password, data.password_repeat));
    }

    const cancelRequest = () => {
        if (otpID) {
            dispatch(forgotPasswordCancel(otpID));
        }
    }

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            return <button style={{ display: "none" }} onClick={cancelRequest()}></button>;     //trigged (fired) cancelRequest function when btn rendered
        } else {
            return (
                <span>
                    OTP gửi đến SĐT của bạn sẽ hết hạn sau {minutes} phút {seconds} giây.
                </span>
            );
        }
    };

    const renderer2 = ({ seconds, completed }) => {
        if (completed) {
            return <button className="register-back-button" onClick={() => cancelRequest()}>🢤 Huỷ yêu cầu</button>;
        } else {
            return (
                <button className="register-back-button-disabled" disabled>Sau {seconds} giây có thể huỷ yêu cầu</button>
            );
        }
    };

    const redirectToLogin = () => {
        if (isSuccessful) {
            history.replace("/login");
            dispatch(forgotPasswordSetStep(0));     //also set timeOutSaved = 0
        }
    }

    const steps = [
        {
            title: 'Nhập SĐT',
            content:
                <div>
                    <form onSubmit={handleSubmit(handleRequestOTP)}>
                        <div className="recovery-form-field">
                            <p className="register-form-label">Số điện thoại</p>
                            <Controller
                                as={InputMask}
                                className="register-form-input"
                                name="phone"
                                control={control}
                                mask="+84 999 999 999"
                                placeholder="+84 912 345 678"
                                autoComplete="off"
                                autoFocus
                                defaultValue=""
                                maskChar={null}
                                rules={{ required: "Bạn hãy điền số điện thoại " }}
                            />
                            <ErrorMessage errors={errors} name="phone">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>
                        </div>
                        <div className="recovery-form-submit">
                            <button disabled={isLoad} className="recovery-button" type="submit">{isLoad ? <LoadingOutlined /> : ""} Gửi mã xác nhận</button>
                        </div>
                    </form>

                    <div className="recovery-form-field register-div-login-suggest">
                        <span>Quay về trang <Link to="/login">Đăng nhập</Link> </span>
                    </div>
                </div>
        },
        {
            title: 'Xác thực OTP',
            content:
                <div>
                    <div className="OTP-status">
                        {startCountdown && otpID && (<Countdown date={timeOutSaved} renderer={renderer} />)}
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(handleVerifyOTP)}>
                            <div className="recovery-form-field">
                                <p className="register-form-label">Mã OTP</p>
                                <input type="number" className="register-form-input" name="otp" autoComplete="off" autoFocus
                                    ref={register({
                                        required: "Bạn hãy điền OTP ",
                                        minLength: {
                                            value: 4,
                                            message: "OTP phải có ít nhất 4 chữ số "
                                        }, maxLength: {
                                            value: 4,
                                            message: "OTP nhiều nhất là 4 chữ số "
                                        }
                                    })}
                                />
                                <ErrorMessage errors={errors} name="otp">
                                    {({ messages }) =>
                                        messages &&
                                        Object.entries(messages).map(([type, message]) => (
                                            <span className="error-text" key={type}>{message}</span>
                                        ))
                                    }
                                </ErrorMessage>
                            </div>
                            <div className="recovery-form-submit">
                                <button disabled={isLoad} className="recovery-button" type="submit">{isLoad ? <LoadingOutlined /> : ""} Xác nhận</button>
                            </div>
                        </form>

                        <div className="recovery-form-field">
                            {currentStep > 0 &&
                                startCountdown && otpID && (<Countdown date={timeOutSaved - 270000} renderer={renderer2} />)
                            }
                        </div>
                    </div>
                </div>
        },
        {
            title: 'Đặt mật khẩu mới',
            content:
                <div>
                    <form onSubmit={handleSubmit(handleResetPassword)}>
                        <div className="recovery-form-field">
                            <p className="register-form-label">Mật khẩu mới</p>
                            <input type="password" className="register-form-input" name="password" autoFocus
                                ref={register({
                                    required: "Bạn hãy điền mật khẩu ",
                                    minLength: {
                                        value: 6,
                                        message: "Mật khẩu phải có ít nhất 6 kí tự "
                                    }, maxLength: {
                                        value: 14,
                                        message: "Mật khẩu nhiều nhất là 14 kí tự "
                                    }
                                })}
                            />
                            <ErrorMessage errors={errors} name="password">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>
                            <p className="register-form-label">Nhập lại mật khẩu</p>
                            <input
                                name="password_repeat"
                                className="register-form-input"
                                type="password"
                                ref={register({
                                    // required: "Bạn hãy điền mật khẩu ",
                                    validate: value =>
                                        value === password.current || "Mật khẩu không khớp "
                                })}
                            />
                            <ErrorMessage errors={errors} name="password_repeat">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>
                        </div>
                        <div className="recovery-form-submit">
                            <button disabled={isLoad} className={`recovery-button ${!isLoad ? "" : "recovery-button-disabled"}`} type="submit">{isLoad ? <LoadingOutlined /> : ""} Gửi mã xác nhận</button>
                        </div>
                        <div className="recovery-form-field"></div>
                    </form>
                </div>
        }
    ];

    useEffect(() => {
        if (isSuccessful || !otpID){
            if (currentStep !== 0 ){
                dispatch(forgotPasswordSetStep(0));     //also set timeOutSaved = 0
            }
        } else {
            if (currentStep > 0) {
                if(timeOutSaved <= Date.now()) {
                    dispatch(forgotPasswordSetStep(0));
                }
            }
        }
    }, []);

    return (
        <div className="recovery">
            <Spin size="large" spinning={isLoad}  >
                <Navbar />
                <div className="recovery-wrapper">
                    {isSuccessful ?
                        <div className="recovery-form">
                            <Result
                                status="success"
                                title="Đặt lại mật khẩu thành công!"
                                subTitle={'Bạn có thể dùng mật khẩu mới để đăng nhập.'}
                                extra={[
                                    <button className="recovery-button-done" onClick={() => redirectToLogin()}>Đăng nhập</button>
                                ]}
                            />
                        </div> :
                        <div className="recovery-form">
                            <h2>Đặt lại mật khẩu</h2>
                            {currentStep===0?<div>Xác thực SĐT và nhập mật khẩu mới</div>:""}
                            <div className="recovery-form-custom">
                                <Steps size="small" current={currentStep}>
                                    {steps.map(item => (
                                        <Step key={item.title} title={item.title} />
                                    ))}
                                </Steps>
                                <div className="steps-content">{steps[currentStep]?.content}</div>
                            </div>
                        </div>
                    }
                </div>
            </Spin>
        </div >
    )
}

export default ForgotPassword;
