import React, { useEffect, useState, useCallback, useRef } from 'react';
import bookingImage from "../../assest/image/booking.png"
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { useForm, Controller } from 'react-hook-form';
import { nextStep, saveBookingInfo, saveBookingDoctor } from '../../redux/booking';
import AsyncPaginate from "react-select-async-paginate";
import userService from '../../service/userService';
import _ from "lodash"
import { message } from "antd"

// import AddressGoogleMap from '../AddressGoogleMap';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import Geocode from "react-geocode";
import Map from './Map';
import doctorService from '../../service/doctorService';
import { Rate, Button } from 'antd';



Geocode.setApiKey("AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw");
Geocode.enableDebug();

// const libraries = ["places"];

const center = {
    lat: 21.0044514,
    lng: 105.5122808,
};

const BookingReason = (props) => {
    const { register, handleSubmit, errors, control } = useForm();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth)
    const [patient, setpatient] = useState({});
    const { currentStep, infos } = useSelector(state => state.booking);
    const { currentUser } = useSelector(state => state.user);
    const [searchAddress, setSearchAddress] = useState("");
    const [currentPosition, setCurrentPostion] = useState(center);
    const [doctor, setdoctor] = useState({});

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 21.0044514, lng: () => 105.5122808 },
            radius: 100 * 1000,
        },
    });

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setValue(address);
            getSearchText(address);
            getPatientPosition({ lat, lng })
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const getSearchText = (value) => {
        setValue(value, false);
        clearSuggestions();
        setSearchAddress(value);
    }

    const getPatientPosition = (position) => {
        setCurrentPostion(position);
    }

    if (currentStep !== 0) {
        return null;
    }

    const onSubmit = data => {
        if (_.isEmpty(patient)) {
            message.destroy()
            message.error("Xin vui lòng chọn bệnh nhân")
        } else {
            const newData = { ...data, address: searchAddress, id: patient.id, fullname: patient.fullname, type: patient.type, position: currentPosition }
            dispatch(saveBookingInfo(newData));
            dispatch(saveBookingDoctor(doctor));
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

    const loadDoctorOptions = async (search, loadedOptions, { page }) => {
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

    const onDoctorChange = (value) => {
        setdoctor(value)
    }

    const clearDoc = () => {
        setdoctor({})
    }

    const doctorOption = (props) => {
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

    return (
        <Animation>
            <div className="booking-contain">
                <div className="booking-introduction">
                    <div className="booking-introduction-left">
                        <div className="booking-step">
                            <div className="booking-text">
                                <span className="hightlight">1. </span> Điền thông tin cơ bản
                            </div>
                            <div className="content-form-div">
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
                                        <div className="search-map-div">
                                            <Combobox onSelect={handleSelect} className="combobox-map-div">
                                                <ComboboxInput
                                                    className="form-field-input"
                                                    value={value}
                                                    onChange={handleInput}
                                                    disabled={!ready}
                                                    placeholder="Nhập vị trí của bạn"
                                                    // defaultValue={searchAddress}
                                                    required
                                                />
                                                <ComboboxPopover>
                                                    <ComboboxList>
                                                        {status === "OK" &&
                                                            data.map(({ id, description, key }) => (
                                                                <ComboboxOption key={key} value={description} />
                                                            ))}
                                                    </ComboboxList>
                                                </ComboboxPopover>
                                            </Combobox>
                                        </div>
                                        {/* <input defaultValue={infos?.address ?? patient?.address} className="form-field-input" name="address" ref={register({ required: true })} /> */}
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
                                    <div className="booking-step">
                                        <div className="booking-guide">
                                            Bạn có thể chọn bác sĩ hoặc để chúng tôi chọn giúp bạn
                                                </div>
                                        <div className="search-doctor">
                                            <AsyncPaginate
                                                loadOptions={loadDoctorOptions}
                                                debounceTimeout={300}
                                                value={{ fullname: doctor?.fullname ?? '', address: (doctor?.address ?? '') }}
                                                components={{ doctorOption }} // customize menu
                                                additional={{
                                                    page: 1,
                                                }}
                                                placeholder={'Bác sĩ'}
                                                getOptionLabel={({ fullname, address }) => fullname + "-" + address}
                                                defaultOptions
                                                cacheOptions
                                                isClearable={true}
                                                required
                                                onChange={onDoctorChange}
                                            />
                                        </div>
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
                                <div className="booking-introduction-image">
                                    <Map patientPosition={currentPosition} getPatientPosition={getPatientPosition} mapRef={props.mapRef} onMapLoad={props.onMapLoad} getSearchText={getSearchText} onDoctorChange={onDoctorChange} />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </Animation>
    );
};

export default BookingReason;