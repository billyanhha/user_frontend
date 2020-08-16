import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import Countdown from 'react-countdown';
import InputMask from 'react-input-mask';

import { changePhone, verifyChangePhone, cancelChangePhone, resetSettingStatus, cancelChangePhoneSuccessful, saveTimeOut } from '../../../../../../redux/user';

import { message, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ChangePhone = () => {
    const { Step } = Steps;
    const { register, handleSubmit, control, watch, errors } = useForm({ validateCriteriaMode: "all" });
    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const { currentUser } = useSelector(state => state.user);
    const token = useSelector(state => state.auth.token);
    const settingStatus = useSelector(state => state.user.settingStatus);
    const phoneNumber = useSelector(state => state.user.phoneNumber);
    const request_id = useSelector(state => state.user.requestID);
    const currentStep = useSelector(state => state.user.currentStep);
    const timeOutSaved = useSelector(state => state.user.savedTimeOut);

    // const [countTime, setCountTime] = useState(0);
    // const [startCountdown, setStartCountdown] = useState(false);

    //Each render → Compare time now with "timeOutSaved" state, if still have time to countdown then countdown.
    let startCountdown = timeOutSaved > Date.now() ? true : false;

    const handleChangePhone = (data) => {
        let phone = data.phone.replace(/\s+/g, '').substring(1);    //clear space and "+"
        let reqData = { phone: phone, password: data.verify_password };
        dispatch(verifyChangePhone(token, reqData, currentUser?.customer_id));
    }

    const handleVerifyOTP = (data) => {
        if (phoneNumber && request_id) {
            let reqData = { phone: phoneNumber, request_id: request_id, code: data.otp };
            dispatch(changePhone(token, reqData, currentUser?.customer_id));
        } else {
            message.warning("Lỗi gửi xác nhận OTP", 3);
        }
    }

    const cancelRequest = () => {
        if (request_id) {
            dispatch(cancelChangePhone(request_id));
        } else {
            message.warning("Không thể huỷ yêu cầu!", 3);
        }
    }

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            return <button style={{ display: "none" }} onClick={cancelRequest()}></button>;
        } else {
            return (
                <span>
                    OTP gửi đến SĐT cũ của bạn sẽ hết hạn trong {minutes} phút {seconds} giây
                </span>
            );
        }
    };

    const renderer2 = ({ seconds, completed }) => {
        if (completed) {
            return <button className="prevButton" onClick={() => cancelRequest()}>🢤 Huỷ yêu cầu</button>;
        } else {
            return (
                <button className="setting-back-button-disabled" disabled>Sau {seconds} giây có thể huỷ yêu cầu</button>
            );
        }
    };

    const steps = [
        {
            title: 'Xác nhận đổi số mới',
            content:
                <form onSubmit={handleSubmit(handleChangePhone)}>
                    <div className="profile-form-field">
                        <p className="profile-form-label">Số điện thoại mới</p>
                        <Controller
                            as={InputMask}
                            className="profile-form-input"
                            name="phone"
                            control={control}
                            mask="+84 999 999 999"
                            placeholder="+84 912 345 678"
                            autoComplete="off"
                            defaultValue=""
                            autoFocus
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
                        <p className="profile-form-label">Xác nhận mật khẩu</p>
                        <input type="password" className="profile-form-input" name="verify_password"
                            ref={register({
                                required: "Bạn hãy điền password ",
                                minLength: {
                                    value: 6,
                                    message: "Password phải có ít nhất 6 kí tự "
                                }, maxLength: {
                                    value: 14,
                                    message: "Password nhiều nhất là 14 kí tự "
                                }
                            })}
                        />
                        <ErrorMessage errors={errors} name="verify_password">
                            {({ messages }) =>
                                messages &&
                                Object.entries(messages).map(([type, message]) => (
                                    <span className="error-text" key={type}>{message}</span>
                                ))
                            }
                        </ErrorMessage>
                    </div>
                    <div className="setting-submit">
                        <button disabled={isLoad} type="submit">{isLoad ? <LoadingOutlined /> : ""} Cập nhật</button>
                    </div>
                </form>
        },
        {
            title: 'Xác thực OTP',
            content:
                <div>
                    <div className="OTP-status">
                        {currentStep === 1 && startCountdown && request_id && (<Countdown date={timeOutSaved} renderer={renderer} />)}
                    </div>
                    <form onSubmit={handleSubmit(handleVerifyOTP)}>
                        <div className="profile-form-field">
                            <p className="profile-form-label">Xác nhận OTP với SĐT cũ</p>
                            <input type="number" className="profile-form-input" name="otp" autoComplete="off" autoFocus
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
                        <div className="setting-submit custom-display-flex">
                            {currentStep === 1 &&
                                startCountdown && request_id && (<Countdown date={timeOutSaved - 270000} renderer={renderer2} />)
                            }
                            <button disabled={isLoad} type="submit">{isLoad ? <LoadingOutlined /> : ""} Cập nhật</button>
                        </div>
                    </form>

                </div>
        }
    ];

    useEffect(() => {
        if (settingStatus) {
            dispatch(resetSettingStatus());
        }
    }, [settingStatus])

    useEffect(() => {
        if (!request_id){
            if (currentStep !== 0 ){
                dispatch(cancelChangePhone(null));    //also set timeOutSaved = 0
            }
        } else {
            if (currentStep > 0) {
                if(timeOutSaved <= Date.now()) {
                    dispatch(cancelChangePhone(request_id));
                }
            }
        }
    }, [])

    return (
        <div className="setting-phone">
            <Steps size="small" current={currentStep}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[currentStep]?.content}</div>
        </div>
    )
}

export default ChangePhone;
