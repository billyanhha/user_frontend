import React, { useState, useEffect } from 'react';
import bookingImage from "../../assest/image/booking.png"
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { preStep, nextStep, saveBookingDoctor } from '../../redux/booking';
import AsyncPaginate from "react-select-async-paginate";
import doctorService from '../../service/doctorService';
import { Rate, Button } from 'antd';
import AddressGoogleMap from '../AddressGoogleMap';

const BookingDoctor = () => {

    const { currentStep, doctorInfo } = useSelector(state => state.booking);
    const [doctor, setdoctor] = useState({});
    const dispatch = useDispatch();



    useEffect(() => {

        if (doctorInfo) {
            setdoctor(doctorInfo)
        }

    }, []);

    if (currentStep !== 1) {
        return null;
    }

    const next = () => {
        dispatch(saveBookingDoctor(doctor));
        dispatch(nextStep());
    }

    const prev = () => {
        dispatch(preStep())
    }

    const loadOptions = async (search, loadedOptions, { page }) => {
        try {
            const response = await doctorService.getDoctorQuery({ query: search, page: page, sortBy: 'average_rating' });

            return {
                options: response?.doctors?.result,
                hasMore: !response?.doctors?.isOutOfData,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    const onChange = (value) => {
        setdoctor(value)
    }

    const clearDoc = () => {
        setdoctor({})
    }

    const Option = (props) => {
        const option = { ...props?.data };
        return (
            <div className="doctors-select" ref={props.innerRef} {...props.innerProps}>
                <div className="doctors-select-img" style={{ backgroundImage: `url(${option.avatarurl})` }} />
                <div>
                    <p className="doctors-select-fullname">{option?.fullname}</p>
                    <p className="doctors-select-fullname">{option?.address}</p>
                    <div className="doctors-select-fullname">
                        <Rate disabled value={option?.average_rating} />
                    </div>
                </div>
            </div>
        )
    }

    const renderChooseDoctor = (
        <div>
            {!doctor?.fullname ?
                <p>Bạn chưa chọn bác sĩ nào </p> :
                (<p>Bạn đã chọn bác sĩ  <b className="hightlight">{doctor?.fullname}</b> đến từ
                    <b className="hightlight"> {doctor?.address}</b>,
                    <Button type="text" onClick={clearDoc} danger>
                        chọn bác sĩ khác
                    </Button>
                </p>)}
            <div className="doctors-select-preview">
                <div className="doctors-select-img" style={{
                    backgroundImage: `url(${doctor?.avatarurl
                        || 'https://hhs.s3-ap-southeast-1.amazonaws.com/doctor-character-background_1270-84.jpg'})`
                }} />
                <div>
                </div>
            </div>
            <div className="doctors-select-fullname">
                {doctor?.fullname && (<Rate disabled value={doctor?.average_rating} />)}
            </div>
        </div>
    )


    return (
        <Animation>
            <div className="booking-contain">
                <div className="booking-introduction">
                    <div className="booking-introduction-left">
                        <div className="booking-step">
                            <div className="booking-text">
                                <span className="hightlight">2. </span> Chọn bác sĩ
                            </div>
                            <div className="booking-guide">
                                Bạn có thể chọn bác sĩ hoặc để chúng tôi chọn giúp bạn
                            </div>
                            <div className="search-doctor">
                                <AsyncPaginate
                                    loadOptions={loadOptions}
                                    debounceTimeout={300}
                                    value={{ fullname: doctor?.fullname ?? '', address: (doctor?.address ?? '') }}
                                    components={{ Option }} // customize menu
                                    additional={{
                                        page: 1,
                                    }}
                                    placeholder={'Bác sĩ'}
                                    getOptionLabel={({ fullname, address }) => fullname + "-" + address}
                                    defaultOptions
                                    cacheOptions
                                    isClearable={true}
                                    required
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                {renderChooseDoctor}
                            </div>
                            <div className="steps-action">
                                <button onClick={next} className="submit-btn">Tiếp theo</button>
                                <button onClick={prev} className="submit-btn-outline">Quay lại</button>
                            </div>
                        </div>
                        <div>
                            <div className="booking-introduction-image">
                                <AddressGoogleMap />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Animation>
    );
};

export default BookingDoctor;