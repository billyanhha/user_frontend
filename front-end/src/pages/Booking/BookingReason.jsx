import React, { useEffect, useState, useCallback, useRef } from 'react';
import bookingImage from "../../assest/image/booking.png"
import { useSelector, useDispatch } from 'react-redux';
import Animation from './Animation';
import { useForm, Controller } from 'react-hook-form';
import { nextStep, saveBookingInfo } from '../../redux/booking';
import AsyncPaginate from "react-select-async-paginate";
import userService from '../../service/userService';
import _ from "lodash"
import { message } from "antd"

// import AddressGoogleMap from '../AddressGoogleMap';

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
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



Geocode.setApiKey("AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw");
Geocode.enableDebug();

// const libraries = ["places"];
const mapContainerStyle = {
    height: '500px',
    width: '100%',
};
const options = {
    // styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};
const center = {
    lat: 21.0044514,
    lng: 105.5122808,
};

const libraries = ["geometry,drawing,places"];

const BookingReason = (props) => {
    const { register, handleSubmit, errors, control } = useForm();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth)
    const { currentStep, infos } = useSelector(state => state.booking);
    const [patient, setpatient] = useState({id: infos?.id??'', fullname: infos?.fullname??'', type: infos?.type??'',});

    const { currentUser } = useSelector(state => state.user);
    const [searchAddress, setSearchAddress] = useState("");
    const [currentPosition, setCurrentPostion] = useState(center);

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
        getSearchText("");
        setValue(e.target.value);
    };

    const rad = (x) => {
        return x * Math.PI / 180;
      };

    const getDistance = (p1, p2) => {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat - p1.lat);
        var dLong = rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
      };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            
            //check if address is too far from SonTay: > 10km
            const sontay = {lat: 21.140790, lng:105.507240};
            console.log(getDistance(sontay,{lat,lng}));
            if(getDistance(sontay,{lat,lng}) > 10000){
                message.destroy();
                message.error("Nơi bạn muốn khám quá xa, bác sĩ có thể từ chối yêu cầu của bạn. Vui vòng chọn vị trí tại khu vực Sơn tây!");
                setValue("", false);
            }else{
                setValue(address);
                getSearchText(address);
                getPatientPosition({ lat, lng })
            }
            

            
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
        if (_.isEmpty(patient?.id)) {
            message.destroy()
            message.error("Xin vui lòng chọn bệnh nhân")
        } 
        else if (searchAddress===""){
            message.destroy()
            message.error("Xin vui lòng chọn địa chỉ hợp lệ được hệ thống gợi ý khi nhập liệu")
        }else {
            const newData = { ...data, address: searchAddress, id: patient.id, fullname: patient.fullname, type: patient.type, position: currentPosition }
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
            message.destroy();
            message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
        }
    }

    const onChange = (value) => {
        setpatient(value)
    }

    const Option = (props) => {
        const option = { ...props?.data };
        return (
            <div className="doctors-select" ref={props.innerRef} {...props.innerProps}>
                <div className="reason-user doctors-select-img " style={{ backgroundImage: `url(${option.avatarurl})` }} />
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
                                    <div className="search-map-div">
                                        <Combobox onSelect={handleSelect} className="combobox-map-div">
                                            <ComboboxInput
                                                className="form-field-input"
                                                value={value}
                                                onChange={handleInput}
                                                disabled={!ready}
                                                placeholder="Nhập địa chỉ điều dưỡng"
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
                </div>
            </div>
        </Animation>
    );
};


export default BookingReason;