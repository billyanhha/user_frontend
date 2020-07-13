import React, { Component, useEffect, useState, useCallback, useRef } from "react";
import './style.css';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import image from '../../assest/image/icon-1024.png'
import "@reach/combobox/styles.css";
import Geocode from "react-geocode";
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightOutlined } from '@ant-design/icons';
import { queryDoctor } from '../../redux/doctor';
import { Link } from 'react-router-dom';
import DirectionMap from './DirectionMap';
import { Modal, Button } from 'antd';

import Search from './Search';
// import mapStyles from "./mapStyles";



Geocode.setApiKey("AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw");
Geocode.enableDebug();

const libraries = ["places"];
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

const App = () => {

    const dispatch = useDispatch();

    const doctor = useSelector(state => state.doctor);
    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw",
        libraries,
    });
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(center);
    const [directions, setDirections] = useState({});
    const [doctorPosition, setDoctorPosition] = useState({});
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        dispatch(queryDoctor({}));

    }, []);

    //When you want to find somewhere address on this map
    const onMapClick = useCallback((e) => {

    }, []);

    const getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    const getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };

    const getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };

    const getLatLngByAddress = (doctor) => {
        // console.log(doctor);
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

    useEffect(() => {
        const array = doctor?.queryDoctor?.filter((doctor, key) => {
            getLatLngByAddress(doctor);

        });

        console.log(array);

    }, [doctor]);

    // console.log(markers);




    const panTo = useCallback(({ lat, lng }) => {
        console.log(lat, lng);
        setCurrentPosition({ lat, lng });

        // const direction = {};
        // const google = window.google;
        // const directionsService = new google.maps.DirectionsService();
        // const origin = this.props.patientPosition;
        // const destination = this.props.doctorPosition;

        // directionsService.route(
        //     {
        //         origin: origin,
        //         destination: destination,
        //         travelMode: google.maps.TravelMode.DRIVING
        //     },
        //     (result, status) => {
        //         if (status === google.maps.DirectionsStatus.OK) {
        //             console.log(result?.routes?.[0]?.legs?.[0]);
        //             direction = result;
        //         } else {
        //             console.error(`error fetching directions ${result}`);
        //         }
        //     }
        // );

        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = e => {

        setVisible(false)
    };

    const handleCancel = e => {

        setVisible(false);
    };



    return (
        <div>
            <Locate panTo={panTo} />
            <Search panTo={panTo} />

            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={9}
                center={center}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {markers.map((marker) => (
                    <Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => {
                            setSelected(marker);
                        }}
                        icon={{
                            url: 'https://hhs.s3-ap-southeast-1.amazonaws.com/doctor/doctor_default.png',
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(70, 70),
                            scaledSize: new window.google.maps.Size(70, 70),
                        }}
                    />
                ))}

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
            <div>
                <Button type="primary" onClick={showModal}>
                    Open Modal
                </Button>
                <Modal
                    title="Basic Modal"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <DirectionMap patientAddress={currentPosition} doctorAddress={markers[0]} />
                </Modal>
            </div>

        </div>
    );
}

export default App;