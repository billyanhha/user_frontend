import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { nextStep, preStep, addPackage, addPackageSuccessful } from '../../redux/booking';
import { message } from 'antd';
import {  Redirect } from "react-router-dom";

const BookingConfirm = () => {
    const { currentStep, infos, doctorInfo, bookingTime, addPackageSuccess } = useSelector(state => state.booking);
    const { isLoad } = useSelector(state => state.ui);
    const [disable, setdisable] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        
        dispatch(addPackageSuccessful(false))

    }, []);

    if (currentStep !== 3) {
        return null;
    }
    
    const submit = () => {
        setdisable(true)
        let request = {};
        request.patient_id = infos?.id
        request.address = infos?.address
        request.reason = infos?.reason
        request.phone = infos?.phone
        if(doctorInfo?.id) { request.doctor_id = doctorInfo?.id }
        request.date = bookingTime?.date
        request.slot_id = bookingTime?.slot_id
        
        dispatch(addPackage(request));
        setTimeout(() => {
            setdisable(false)
        }, 1000);
    }

    if(addPackageSuccess) {
        return <Redirect to ="/"/>
    }

    const prev = () => {
        dispatch(preStep())
    }

    return (
        <Animation>
            <div className="booking-contain">
                <div className="booking-introduction">
                    <div className="booking-introduction-left">
                        <div className="booking-step">
                            <div className="booking-text">
                                <span className="hightlight">4. </span> Xác nhận
                            </div>
                            <div className="booking-guide">
                                <p><b>Bệnh nhân :   </b> {infos?.fullname} - {(infos?.type === 'INDEPENDENT' ? ' Tôi ' : infos?.type)}</p>
                                <p><b>Địa chỉ :     </b> {infos?.address}</p>
                                <p><b>Số điện thoại :</b> {infos?.phone}</p>
                                <p><b>Nguyên nhân : </b> {infos?.reason}</p>
                                <p><b>Bác sĩ :      </b> {doctorInfo?.fullname}</p>
                                <p><b>Thời gian :   </b> {bookingTime?.date} - vào slot {bookingTime?.slot_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="steps-action">
                    <button onClick={prev} className="submit-btn-outline">Quay lại</button>
                    <button disabled = {disable || isLoad} onClick={submit}
                    className={disable ? "disalbe-submit-btn" : "submit-btn"}>Xác nhận</button>
                </div>
            </div>
        </Animation>
    );
};

export default BookingConfirm;