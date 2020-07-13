import React, { useEffect, useState } from 'react';
import bookingImage from "../../assest/image/booking.png"
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { useForm } from 'react-hook-form';
import { nextStep, saveBookingInfo } from '../../redux/booking';
import AsyncPaginate from "react-select-async-paginate";
import userService from '../../service/userService';
import _ from "lodash"
import { message } from "antd"
import AddressGoogleMap from '../AddressGoogleMap';


const BookingReason = (props) => {


    const { register, handleSubmit, errors, control } = useForm();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth)
    const [patient, setpatient] = useState({});


    // step 0

    const { currentStep, infos } = useSelector(state => state.booking);
    const { currentUser } = useSelector(state => state.user);

    if (currentStep !== 0) {
        return null;
    }

    const onSubmit = data => {
        if (_.isEmpty(patient)) {
            message.destroy()
            message.error("Xin vui lòng chọn bệnh nhân")
        } else {
            const newData = { ...data, id: patient.id, fullname: patient.fullname, type: patient.type }
            dispatch(saveBookingInfo(newData));
            dispatch(nextStep());
        }
    };

    const loadOptions = async (search, loadedOptions, { page }) => {
        try {
            const response = await userService.getCustomerPatient(currentUser?.cusId, token);
            return {
                options: response?.patients,
                hasMore: false,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.log(error);
        }
    }


    const onChange = (value) => {
        setpatient(value)
    }



    const Option = (props) => {
        const option = { ...props?.data };


        return (
            <div className="doctors-select" ref={props.innerRef} {...props.innerProps}>
                <div className="doctors-select-img" style={{ backgroundImage: `url(${option.avatarurl})` }} />
                <div>
                    <p className="doctors-select-fullname">{option?.fullname}</p>
                    <p className="doctors-select-fullname">{option?.address}</p>
                    <p className="doctors-select-fullname">
                        <b>{option?.type === 'INDEPENDENT' ? 'Tôi' : option?.type}</b>
                    </p>
                </div>
            </div>
        )
    }


    return (
        <Animation>
            <div className="booking-contain">
                <div className="booking-introduction">
                    <div className="booking-introduction-left">
                        <div className="booking-step">
                            <div className="booking-text">
                                <span className="hightlight">1. </span> Điền thông tin cơ bản
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-field-booking">
                                    <p className="form-booking-label">Khám cho</p>
                                    <div className="search-doctor">
                                        <AsyncPaginate
                                            loadOptions={loadOptions}
                                            isClearable={true}
                                            debounceTimeout={300}
                                            defaultValue={{ fullname: infos?.fullname ?? '', type: (infos?.type ?? '') }}
                                            components={{ Option }} // customize menu
                                            additional={{
                                                page: 1,
                                            }}
                                            isSearchable={false}
                                            placeholder={'Bệnh nhân'}
                                            getOptionLabel={({ fullname, type }) => fullname + " - " + (type === 'INDEPENDENT' ? 'Tôi' : type)}
                                            defaultOptions
                                            cacheOptions
                                            required
                                            onChange={onChange}
                                        />
                                    </div>
                                    {/* <input defaultValue={infos?.patient ?? ''} className="form-field-input" name="patient" ref={register({ required: true })} />
                                    {errors.patient && <span className="error-text">Xin vui lòng không bỏ trống</span>} */}
                                </div>
                                <div className="form-field-booking">
                                    <p className="form-booking-label">Địa chỉ</p>
                                    <input defaultValue={infos?.address ?? patient?.address} className="form-field-input" name="address" ref={register({ required: true })} />
                                    {errors.address && <span className="error-text">Xin vui lòng không bỏ trống</span>}
                                </div>
                                <div className="form-field-booking">
                                    <p className="form-booking-label">Số điện thoại</p>
                                    <input defaultValue={infos?.phone ?? currentUser?.phone}
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
                                    <button type="submit" className="submit-btn">Tiếp theo</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div>
                        <div className="booking-introduction-image">
                            <AddressGoogleMap />
                        </div>
                    </div>
                </div>
            </div>
        </Animation>
    );
};

export default BookingReason;