import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import Geocode from "react-geocode";
import { ArrowRightOutlined } from '@ant-design/icons';
import { queryDoctor } from '../../redux/doctor';
import { Link } from 'react-router-dom';


const mapContainerStyle = {
    height: '600px',
    width: '100%',
};
const options = {
    // styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
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
            <img src="https://illalet.com/wp-content/uploads/2017/07/16_2_35.png" alt="compass" />
        </button>
    );
}

const Map = ({ patientPosition, getPatientPosition, mapRef, onMapLoad, getSearchText, onDoctorChange }) => {

    const dispatch = useDispatch();
    const doctor = useSelector(state => state.doctor);
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [currentPosition, setCurrentPosition] = useState({ position: { lat: 21, lng: 105 }, name: "" });
    const [doctorPosition, setDoctorPosition] = useState({});
    const [checkPoint, setCheckPoint] = useState(false);
    const [doctorSize, setDoctorSize] = useState(0);
    const [selectedDoctor, setSelectedDoctor] = useState({});

    const panTo = useCallback(({ lat, lng }) => {
        setCurrentPosition({ position: { lat, lng }, name: "Đại học FPT, Hoà Lạc" });
        setMarkers((current) => {
            let doctor = current;
            let patient = { lat, lng };
            doctor[doctorSize] = patient;

            return [...current];
        });

        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, [doctorSize]);

    useEffect(() => {
        dispatch(queryDoctor({}));
    }, []);

    useEffect(() => {
        if (checkPoint) {
            console.log(currentPosition);
            getPatientPosition(currentPosition?.position);
            // console.log('makrer',markers[size(doctor?.queryDoctor)]);
            getSearchText(currentPosition?.name);
        }
        setCheckPoint(false);
    }, [checkPoint]);

    useEffect(() => {
        console.log(selectedDoctor);
        console.log(size(selectedDoctor));
        if (size(selectedDoctor) > 0)
            onDoctorChange(selectedDoctor)
    }, [selectedDoctor]);

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
                setCurrentPosition({ position: { lat, lng }, name: valueAddress?.[0]?.formatted_address })
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
        setDoctorSize(size(doctor?.queryDoctor));

    }, [doctor]);

    const icons = [
        {
            icon: 'https://hhs.s3-ap-southeast-1.amazonaws.com/doctor/doctor_default.png'
        }
    ];

    const displayMarkers = markers.map((marker, key) => (
        key !== doctorSize ?
            (<Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                type={'doctor'}
                onClick={() => {
                    setSelected(marker);
                    const selectedDoctor = doctor?.queryDoctor?.filter((value,key) =>{
                        if(value.id === marker?.doctorId){
                            return value
                        }
                    });
                    setSelectedDoctor(selectedDoctor[0]);
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
            <div className="locate-icon-div">
                <Locate panTo={panTo} />
            </div>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={9}
                center={patientPosition}
                options={options}
                onClick={(e) => onMapClick(e, doctorSize)}
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

export default Map;