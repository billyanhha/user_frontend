import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { Link, Redirect } from "react-router-dom";
import axios from '../../axios'
import Countdown from 'react-countdown';
import InputMask from 'react-input-mask';
import Navbar from '../../components/Navbar';
import { guestSendPhone, guestSendOTP, guestRegister, setProcessRegister } from '../../redux/auth';
import vi from 'date-fns/locale/vi'
import { message } from 'antd';
import "./style.css";

const Register = () => {
    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const step = useSelector(state => state.auth.stepRegister);
    const otpID = useSelector(state => state.auth.otpID);
    const phoneNumber = useSelector(state => state.auth.phoneNumber);
    const fullName = useSelector(state => state.auth.fullName);
    const dob = useSelector(state => state.auth.dob);
    const gender = useSelector(state => state.auth.gender);
    const isRegisterSuccessful = useSelector(state => state.auth.isRegisterSuccess);
    const [disable, setdisable] = useState(false);
    const [timeOut, setTimeOut] = useState(0);
    const [isTimeOut, setIsTimeOut] = useState(false);


    //==========  Handle Countdown Button ==========
    // const Completionist = () => <span></span>

    // Renderer callback with condition for Timeout OTP
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            message.destroy();
            message.warning("Mã OTP đã hết hạn")
            if (isTimeOut) {
                backButton()
            }
            // dispatch(setProcessRegister(0));       //send guest back to step 1 (set redux state stepRegister = 0)
            // Render a complete state
            return <span></span>;
        } else {
            // Render a countdown
            return (
                <span>
                    Mã sẽ hết hạn trong {seconds} giây
                </span>
            );
        }
    };

    // Renderer callback with condition for Back button
    const renderer2 = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span><button className="register-back-button" onClick={backButton}>🢤 Tôi muốn sử dụng SĐT khác</button>Mã OTP đã hết hạn!</span>;
        } else {
            // Render a countdown
            return (
                <button className="register-back-button-disabled" disabled>Sau {seconds} giây có thể huỷ yêu cầu</button>
            );
        }
    };

    //==========  Handle Submit form ==========
    const onSubmit = (data) => {
        /*Known ISSUE: Step 3 backend response: status: "101", error_text: "No response found"
            Its force user submit pass 1 more time
         */

        switch (step) {
            //0: submit phone
            case 0: {
                setdisable(true)
                console.log(data.phone.replace(/\s+/g, '').substring(1));
                axios.post("/api/customer/user/phone", {
                    // phone: "84" + data.phone.substring(1)
                    phone: data.phone.replace(/\s+/g, '').substring(1)
                })
                    .then((res) => {
                        if (res.data.exist == true) {
                            message.destroy();
                            message.warning("SĐT này đã được đăng kí");
                            setdisable(false);
                        } else {
                            let basicData = {
                                phone: data.phone.replace(/\s+/g, '').substring(1),
                                // phone: "84" + data.phone.substring(1),
                                fullName: data.fullname,
                                gender: data.gender.value,
                                dob: moment(data.Datepicker).format('YYYY/MM/DD')
                            }
                            dispatch(guestSendPhone(basicData));
                            setTimeOut(Date.now())
                            setIsTimeOut(true)
                            setTimeout(() => {
                                setdisable(false);
                            }, 1000);

                        }
                    })
                    .catch(err => {
                        message.destroy();
                        message.warning("Hệ thống quá tải, xin thử lại sau!");
                    });

                // Test parse string to date and format it.
                // let testTime = moment("20/5/2012", "YYYY-MM-DD")
                // console.log("test parst 20/5/2012 string to moment: " + testTime);
                // console.log(moment(testTime).format('YYYY/MM/DD'));

                setTimeout(() => {
                    setdisable(false)
                }, 2000);
                break;
            }

            //1: verify OTP
            case 1: {
                setdisable(true)
                let otpData = { otpID: otpID, otp: data.otp }
                dispatch(guestSendOTP(otpData));
                
                setTimeout(() => {
                    setdisable(false)
                }, 1000);
                break;
            }

            //2: submit password
            case 2: {
                setdisable(true)
                let registerData = {
                    otpID: otpID,
                    phone: phoneNumber,
                    password: data.password,
                    fullName: fullName,
                    gender: gender,
                    dob: dob
                }
                dispatch(guestRegister(registerData));
                setTimeOut(Date.now())
                setIsTimeOut(true)
                setTimeout(() => {
                    setdisable(false)
                }, 1000);
                break;
            }

            default: {
                console.log("Step is: " + step)
                break;
            }
        }
    };

    const backButton = () => {
        //Call api cancel request
        if (!isLoad) {
            axios.post("/api/auth/verifyCancel", {
                request_id: otpID
            })
                .then((res) => {
                    dispatch(setProcessRegister(0));
                    setTimeOut(0)
                    setIsTimeOut(false)
                })
                .catch(err => {
                    message.destroy();
                    message.warning("Không thể thực hiện yêu cầu")
                });
        }
    }

    //Input phone number
    const StepOne = (props) => {
        const { register, handleSubmit, watch, errors, control } = useForm({ validateCriteriaMode: "all" });
        const options = [
            { value: "Male", label: "Nam" },
            { value: "Female", label: "Nữ" }
        ];

        useEffect(() => {
            if (step === undefined)
                dispatch(setProcessRegister(0));
        }, [step]);

        if (props.currentStep === 1 || props.currentStep === 2)
            return null;
        return (
            <div className="register-form-content">
                <h2>Tham gia cùng chúng tôi!</h2>
                <div>Đăng kí nhanh chóng, hãy điền thông tin cơ bản của bạn.
                 Chúng tôi sẽ gửi mã xác nhận ngay!</div>
                <div className="register-form-custom">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="register-form-field">
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

                            <p className="register-form-label">Họ và tên</p>
                            <input type="text" className="register-form-input" name="fullname"
                                ref={register({
                                    required: "Bạn hãy điền tên đầy đủ ",
                                    minLength: {
                                        value: 6,
                                        message: "Họ Tên quá ngắn, bạn có chắc mình nhập đúng? "
                                    }
                                })}
                            />
                            <ErrorMessage errors={errors} name="fullname">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>

                            <p className="register-form-label">Giới tính</p>
                            <Controller
                                as={<Select options={options} />}
                                name="gender"
                                control={control}
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#e0fff9',
                                        primary: '#00bc9a',
                                    },
                                })}
                                rules={{ required: true }}
                                onChange={([selected]) => {
                                    // Place your logic here
                                    return selected;
                                }}
                                defaultValue={{ value: "Male", label: "Nam" }}
                            />

                            <p className="register-form-label">Sinh nhật</p>
                            <Controller
                                as={<DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    maxDate={new Date(2002, 11, 31)}
                                    locale={vi}
                                    autoComplete="off"
                                    required
                                />}
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected}
                                name="Datepicker"
                                className="input"
                                placeholderText="Ngày sinh"
                            />
                        </div>

                        <div className="register-form-field">
                            <button disabled={disable || isLoad} className={disable ? "disable-button" : "default-button"} type="submit">Gửi OTP</button>
                        </div>
                    </form>

                    <div className="register-form-field register-div-login-suggest">
                        <span>Bạn đã là thành viên? <Link to="/login">Đăng nhập</Link> </span>
                    </div>
                </div>

                {/* <div className="register-form-field register-div-other-options">
                    <div>Hoặc</div>
                    <hr />
                    <div>Đăng kí bằng Facebook, Google</div>
                </div> */}
            </div>
        );
    }

    //Verify OTP
    const StepTwo = (props) => {
        const { register, handleSubmit, watch, errors } = useForm({ validateCriteriaMode: "all" });
        if (props.currentStep !== 1)
            return null;
        return (
            <div className="register-form-content">
                <h2>Xác nhận mã OTP</h2>
                <div>OTP đã gửi đến SĐT của bạn.<br />
                    {/* <Countdown date={Date.now() + 60000} renderer={renderer} /> */}
                    {isTimeOut && (<Countdown date={timeOut + 60000} renderer={renderer} />)}
                </div>
                <div className="register-form-custom">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="register-form-field">
                            <p className="register-form-label">Mã OTP</p>
                            <input type="number" className="register-form-input" name="otp" autoFocus
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
                            {/* <InputMask className="register-form-input" name="otp" mask={'9  9  9  9'} /> */}
                            <ErrorMessage errors={errors} name="otp">
                                {({ messages }) =>
                                    messages &&
                                    Object.entries(messages).map(([type, message]) => (
                                        <span className="error-text" key={type}>{message}</span>
                                    ))
                                }
                            </ErrorMessage>
                        </div>
                        <div className="register-form-field">
                            <button disabled={disable || isLoad} className={disable ? "disable-button" : "default-button"} type="submit">Xác thực OTP</button>
                        </div>
                    </form>

                    <div className="register-form-field register-div-button-disabled">
                        {isTimeOut && (<Countdown date={timeOut + 30000} renderer={renderer2} />)}
                    </div>
                </div>
            </div>
        );
    }

    //Submit password
    const StepThree = (props) => {
        const { register, handleSubmit, watch, errors } = useForm({ validateCriteriaMode: "all" });
        const dispatch = useDispatch();
        const password = useRef({});
        password.current = watch("password", "");

        if (props.currentStep !== 2)
            return null;
        else if (props.isRegisterSuccessful) {
            dispatch(setProcessRegister(0));       //send guest back to step 1 (set redux state stepRegister = 0)
            return <Redirect to="/login" />
        }
        return (
            <div className="register-form-content">
                <h2>Hoàn thành việc tạo tài khoản</h2>
                <div>Chỉ còn một bước nữa thôi! Chào mừng bạn!</div>
                <div className="register-form-custom">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="register-form-field">
                            <p className="register-form-label">Mật khẩu</p>
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
                        <div className="register-form-field">
                            <button disabled={disable || isLoad} className={disable ? "disable-button" : "default-button"} type="submit">Tạo tài khoản</button>
                        </div>
                    </form>
                    <div className="register-form-field">
                        {isTimeOut && (<Countdown date={timeOut + 30000} renderer={renderer2} />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="register">
            <Navbar />
            <div className="register-div">
                <div className="register-cover"></div>
                <div className="register-form">
                    <Fragment>
                        <StepOne currentStep={step} />
                        <StepTwo currentStep={step} />
                        <StepThree currentStep={step} isRegisterSuccessful={isRegisterSuccessful} />
                    </Fragment>
                </div>
            </div>
            <div />
        </div >
    );

}

export default Register;