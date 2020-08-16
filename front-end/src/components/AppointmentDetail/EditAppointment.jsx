import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from "lodash"
import { useForm } from 'react-hook-form';
import { updateAppointmentPackage } from '../../redux/package';

const config = {
    readonly: false // all options from https://xdsoft.net/jodit/doc/
}

const EditAppointment = (props) => {



    const infos = props?.currentAppointment;
    const { register, handleSubmit, errors, control, reset } = useForm();
    const { packageInfo } = useSelector(state => state.package);
    const { token } = useSelector(state => state.auth);
    const { isLoad } = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const [disable, setdisable] = useState(false);

    useEffect(() => {
        

    }, [infos]);

    const onSubmit = (data) => {

        data.token = token;
        let patientId = packageInfo.patient_id
        let appointmentId = infos.id
        let packageId = props.match.params.id
        dispatch(updateAppointmentPackage(data, appointmentId, patientId, packageId))
        reset()
        props.close()
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} disabled={true}>
                <div className="form-field-booking">
                    <p className="form-booking-label">Địa chỉ khám</p>
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
                <div className="steps-action">
                    <button disabled={disable || isLoad} type="submit" className="submit-btn">Sửa</button>
                </div>
            </form>
        </div>
    );
};

export default withRouter(EditAppointment);