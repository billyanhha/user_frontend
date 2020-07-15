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
import image from '../../assest/image/icon-1024.png'
import "@reach/combobox/styles.css";
import Geocode from "react-geocode";
import DirectionMap from '../AddressGoogleMap/DirectionMap';
import { ArrowRightOutlined } from '@ant-design/icons';
import { queryDoctor } from '../../redux/doctor';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'antd';

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

const BookingReason = (props) => {


    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: "AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw",
    //     libraries,
    // });

    const { register, handleSubmit, errors, control } = useForm();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth)
    const [patient, setpatient] = useState({});

    // console.log(props);

    // step 0

    const { currentStep, infos } = useSelector(state => state.booking);
    const { currentUser } = useSelector(state => state.user);
    const [searchAddress, setSearchAddress] = useState("");
    const [currentPosition, setCurrentPostion] = useState({});

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
                                    <div className="search-map-div">
                                        <Combobox onSelect={handleSelect} className="combobox-map-div">
                                            <ComboboxInput
                                                className="form-field-input"
                                                value={value}
                                                onChange={handleInput}
                                                disabled={!ready}
                                                placeholder="Nhập vị trí của bạn"
                                                defaultValue={searchAddress}
                                                required
                                            />
                                            <ComboboxPopover>
                                                <ComboboxList>
                                                    {status === "OK" &&
                                                        data.map(({ id, description,key }) => (
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

                    <div className="booking-introduction-image">

                        <App patientPosition={currentPosition} getPatientPosition={getPatientPosition} mapRef={props.mapRef} onMapLoad={props.onMapLoad} getSearchText={getSearchText} />
                    </div>

                </div>
            </div>
        </Animation>
    );
};

function Locate({ panTo }) {
    return (
        <button
            className="locate"
            onClick={() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        panTo({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => null
                );
            }}
        >
            <img src={image} alt="compass" />
        </button>
    );
}


const App = ({ patientPosition, getPatientPosition, mapRef, onMapLoad, getSearchText }) => {
    const center = {
        lat: 21.0044514,
        lng: 105.5122808,
    };

    const dispatch = useDispatch();
    const doctor = useSelector(state => state.doctor);
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [currentPosition, setCurrentPosition] = useState({position:{lat:21,lng:105},name:""});
    const [doctorPosition, setDoctorPosition] = useState({});
    const current = patientPosition ? patientPosition : center;
    const [checkPoint, setCheckPoint] = useState(false);

    const panTo = useCallback(({ lat, lng }) => {
        setCurrentPosition({position:{ lat, lng },name:"Đại học FPT, Hoà Lạc"})

        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    useEffect(() => {
        dispatch(queryDoctor({}));

    }, []);

    useEffect(() => {
        if (checkPoint){
            console.log(currentPosition);
            getPatientPosition(currentPosition?.position);
            // console.log('makrer',markers[size(doctor?.queryDoctor)]);
            getSearchText(currentPosition?.name);
        }

        setCheckPoint(false);
    }, [checkPoint]);

    //When you want to find somewhere address on this map
    const onMapClick = useCallback((e, data) => {
        Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
            response => {
                const valueAddress = response?.results?.filter((value, key) => {
                    let string = value.formatted_address;
                    if (!string.includes("Unnamed"))
                        return value;
                });
                let lat = e.latLng.lat();
                let lng = e.latLng.lng();
                setCurrentPosition({position:{ lat, lng },name:valueAddress?.[0]?.formatted_address})
                setCheckPoint(true);
                const position = {
                    lat,
                    lng,
                    name: valueAddress?.[0]?.formatted_address
                }
                setMarkers((current) => {
                    let doctor = current;
                    let patient = position;
                    doctor[data] = patient;

                    return [...current];
                });
            },
            error => {
                console.error(error);
            }
        );

    }, []);

    const getLatLngByAddress = (doctor) => {
        let addressName = doctor?.address;
        const { id, avatarurl, fullname, address } = doctor;
        Geocode.fromAddress(addressName).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location
                setMarkers((current) => [
                    ...current,
                    {
                        lat,
                        lng,
                        avatarurl,
                        fullname,
                        address,
                        doctorId: id
                    },
                ]);
            },
            error => {
                console.error(error);
            }
        );
    }

    //get Size array Object
    const size = (obj) => {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    useEffect(() => {
        const array = doctor?.queryDoctor?.filter((doctor, key) => {
            getLatLngByAddress(doctor);
        });
    }, [doctor]);

    const icons = [
        {
            icon: 'https://hhs.s3-ap-southeast-1.amazonaws.com/doctor/doctor_default.png'
        }
    ];

    const displayMarkers = markers.map((marker, key) => (
        key !== size(doctor?.queryDoctor) ?
            (<Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                type={'doctor'}
                onClick={() => {
                    setSelected(marker);
                }}
                icon={{
                    url: icons[0].icon,
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(70, 70),
                    scaledSize: new window.google.maps.Size(70, 70),
                }}
            />)
            :
            (<Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                    setSelected(marker);
                }}
            />)

    ));

    return (
        <div>
            <Locate panTo={panTo} />
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={patientPosition ? patientPosition : center}
                options={options}
                onClick={(e) => onMapClick(e, size(doctor?.queryDoctor))}
                onLoad={onMapLoad}
            >
                {displayMarkers}

                {selected ? (
                    <InfoWindow
                        position={{ lat: selected.lat, lng: selected.lng }}
                        onCloseClick={() => {

                            setSelected(null);
                        }}
                    >
                        <div>
                            <h2>Bác sĩ</h2>
                            <div className="map-doctor-info-div">
                                <div className="map-doctor-image-div">
                                    <img src={selected.avatarurl} />
                                </div>
                                <p>{selected.fullname}</p>

                                <h4>{selected.address}</h4>
                            </div>
                            <div className="map-detail-div">
                                <Link target="_blank" to={"doctor/" + selected.doctorId} >Chi tiết</Link>
                                <span className="chitiet-div"><ArrowRightOutlined /></span>
                            </div>
                        </div>
                    </InfoWindow>
                ) : null}

            </GoogleMap>
        </div>
    );
}

export default BookingReason;