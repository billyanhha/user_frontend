import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, withRouter} from "react-router-dom";

import {LoadingOutlined} from "@ant-design/icons";

import {subcribeEmail} from "../../redux/user";

import logo from "../../assest/logo/IKEMEN.png";
import "./style.css";

const UnSubsEmail = props => {
    const {isLoad} = useSelector(state => state.ui);
    const verifyStatus = useSelector(state => state.user.verifyEmail);

    const tokenMail = props.match.params?.token;

    const history = useHistory();
    const dispatch = useDispatch();

    const redirectToHomepage = () => {
        history.replace("/");
    };

    useEffect(() => {
        if (tokenMail) {
            dispatch(subcribeEmail(tokenMail, 1));
        }else{
            history.replace("/404");    //to NoMatch page
        }
    }, []);

    return (
        <div className="unsub-email-page">
            <div className="verify-email-logo" onClick={() => redirectToHomepage()}>
                <img alt="logo" src={logo} />
            </div>
            <div className="unsub-email-wrapper">
                <div>
                    {isLoad ? (
                        <>
                            <div className="verify-email-img">
                                <img src="https://img.icons8.com/cotton/100/000000/refresh-mail.png" />
                            </div>
                            <div className="verify-email-msg">
                                <LoadingOutlined /> Đang gửi yêu cầu...
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="verify-email-img">
                                <img
                                    src={
                                        verifyStatus === true
                                            ? "https://img.icons8.com/cotton/100/000000/reading-confirmation.png"
                                            : "https://img.icons8.com/cotton/100/000000/mail-error.png"
                                    }
                                />
                            </div>
                            {verifyStatus === true ? (
                                <>
                                    <div className="verify-email-title">Đã huỷ đăng kí Email của bạn!</div>
                                    <div>Hệ thống sẽ không gửi những cập nhật, thông báo mới đến Email của bạn.</div>
                                </>
                            ) : (
                                <>
                                    <div className="verify-email-title verify-email-error">{verifyStatus ?? "Có lỗi khi huỷ đăng kí Email."}</div>
                                    <div>{!verifyStatus ? "Xin hãy vào lại link trong Email, hoặc liên hệ với chúng tôi để nhận hỗ trợ." : ""}</div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className="verify-email-to-login">
                    <button disabled={isLoad} className="recovery-button" onClick={() => redirectToHomepage()}>
                        Đến trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withRouter(UnSubsEmail);
