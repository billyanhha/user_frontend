import React from 'react';
import "./style.css"
import Navbar from '../../components/Navbar';
import { useForm } from "react-hook-form";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from '../../redux/auth';
import { useState } from 'react';
import { useEffect } from 'react';


const Login = (props) => {

    const { register, handleSubmit, watch, errors } = useForm();
    const { isLoad } = useSelector(state => state.ui);
    const { isLoggedIn } = useSelector(state => state.auth);
    const [disable, setdisable] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0) // make sure div in top
    }, []);

    const onSubmit = data => {
        setdisable(true)
        let {phone} = data;
        phone = '84' + phone;
        data.phone = phone
        dispatch(userLogin(data));
        setTimeout(() => {
            setdisable(false)
        }, 1000);
    };

    if (isLoggedIn) {
        return <Redirect to="/" />
    }

    return (
        <div className="login">
            <Navbar />
            <div className="login-div">
                <div className="login-div-form">
                    <h2>Đăng nhập</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-field">
                            <p className="label">Số điện thoại</p>
                            <div class="form-field-phone">

                                <div className = "form-field-phone-label">84 - </div>
                                <input type ="number" name="phone" ref={register({ required: true })} />

                            </div>
                            {errors.phone && <span className="error-text">Xin vui lòng không bỏ trống</span>}
                        </div>
                        <div className="form-field">
                            <p className="label">Mật khẩu</p>
                            <input name="password" className="form-field-input" type="password" ref={register({ required: true })} />
                            {errors.password && <span className="error-text">Xin vui lòng không bỏ trống</span>}
                        </div>
                        <div className="form-field">
                            <button disabled={disable || isLoad} className={disable ? "disable-button" : "default-button"} type="submit">Đăng nhập</button>
                        </div>
                        <div className="form-field login-div-signup-suggest">
                            <span>Bạn chưa có tải khoản ? <Link to="/register">Đăng kí </Link> </span>
                        </div>
                        <div className="form-field login-div-signup-suggest">
                            <span><Link to="/password-recovery">Quên mật khẩu?</Link></span>
                        </div>
                    </form>
                </div>
            </div>
            <div />
        </div >
    );
};

export default Login;