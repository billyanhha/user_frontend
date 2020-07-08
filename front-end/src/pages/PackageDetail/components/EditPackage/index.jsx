import React from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { updatePackage } from '../../../../redux/package';

const EditPackage = (props) => {

    const {infos} = props;
    const { register, handleSubmit, errors, control } = useForm();
    const {isLoad} = useSelector(state=> state.ui);
    const dispatch = useDispatch();

    const [disable, setdisable] = useState(false);

    const onSubmit = (data) => {
        
        setdisable(true);
        data.patient_id = infos?.patient_id
        data.package_id = infos?.id;
        
        dispatch(updatePackage(data))
        setTimeout(() => {
            setdisable(false);
        }, 1000);
    }

    

    return (
        <form onSubmit={handleSubmit(onSubmit)} disabled = {true}>
            <div className="form-field-booking">
                <p className="form-booking-label">Địa chỉ</p>
                <input defaultValue={infos?.address} className="form-field-input" name="address" ref={register({ required: true })} />
                {errors.address && <span className="error-text">Xin vui lòng không bỏ trống</span>}
            </div>
            <div className="form-field-booking">
                <p className="form-booking-label">Số điện thoại</p>
                <input defaultValue={infos?.phone}
                    className="form-field-input"
                    name="phone"
                    ref={
                        register(
                            {
                                pattern: /^([0]{1}|[84]{1})([0-9]{8,10})$/,
                                required: true
                            })
                    }
                />
                {errors.phone && <span className="error-text">Số điện thoại sai</span>}
            </div>
            <div className="form-field-booking">
                <p className="form-booking-label">Lý do</p>
                <textarea defaultValue={infos?.reason ?? ''} name="reason" className="form-text-area" ref={register({ required: true })} />
                {errors.reason && <span className="error-text">Xin vui lòng không bỏ trống</span>}
            </div>
            <div className="steps-action">
                <button disabled = {disable || isLoad} type="submit" className="submit-btn">Sửa</button>
            </div>
        </form>
    );
};

export default EditPackage;