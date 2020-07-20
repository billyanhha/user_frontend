import React, { useState, useEffect } from 'react';
import bookingImage from "../../assest/image/booking.png"
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { preStep, nextStep, saveBookingDoctor } from '../../redux/booking';
import AsyncPaginate from "react-select-async-paginate";
import doctorService from '../../service/doctorService';
import { Rate, Button } from 'antd';
import DirectionMap from '../AddressGoogleMap/DirectionMap';
import Geocode from "react-geocode";
import Map from './Map';

Geocode.setApiKey("AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw");
Geocode.enableDebug();

const BookingDoctor = (props) => {

    const { currentStep, doctorInfo, infos } = useSelector(state => state.booking);
    const [doctor, setdoctor] = useState({});
    const [currentDoctor, setCurrentDoctor] = useState({});
    const [ready, setReady] = useState(false);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {

        if (doctorInfo) {
            setdoctor(doctorInfo)
        }

    }, []);

    const size = (obj) => {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    useEffect(()=>{
        console.log(currentDoctor);
        if(size(currentDoctor)>0){
            setReady(true);
            showModal();
        }
    },[currentDoctor]);

    if (currentStep !== 1) {
        return null;
    }

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = e => {
        setVisible(false)
    };

    const handleCancel = e => {
        setVisible(false)
    };


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
        Geocode.fromAddress(value?.address).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                setCurrentDoctor({lat,lng});
            },
            error => {
                console.error(error);
            }
        );
        setdoctor(value);
        
        
    }

    const clearDoc = () => {
        setdoctor({});
        
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
                        <div className="doctor-booking-step">
                            <div className="booking-text">
                                <span className="hightlight">2. </span> Chọn bác sĩ
                            </div>
                            <div className="content-doctor-form-div">
                                <div className="doctor-form-div">
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

                                </div>
                                <div className="booking-introduction-image">
                                    {ready && visible && <Map handleCancel={handleCancel} visible={visible} patientAddress={infos?.position} doctorAddress={currentDoctor} />}

                                </div>
                            </div>
                            <div className="steps-action">
                            <button onClick={prev} className="submit-btn-outline">Quay lại</button>
                                <button onClick={next} className="submit-btn">Tiếp theo</button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </Animation>
    );
};

export default BookingDoctor;