import React, { Component, useEffect, useState, useCallback, useRef } from "react";
import './style.css';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    DirectionsRenderer
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
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightOutlined } from '@ant-design/icons';
import { queryDoctor } from '../../redux/doctor';
import { Link } from 'react-router-dom';
import DirectionMap from './DirectionMap';
import { Modal, Button } from 'antd';

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
const  Search = ({ panTo }) => {
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
        setValue(address, "");
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            // console.log(results);
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div className="search">
            {console.log(ready)}
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Nhập địa chỉ điều dưỡng"

                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
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
        setDirections( {
            "geocoded_waypoints" : [
               {
                  "geocoder_status" : "OK",
                  "place_id" : "ChIJ4_y9G5BbNDER0GUgOSWJVQs",
                  "types" : [ "route" ]
               },
               {
                  "geocoder_status" : "OK",
                  "place_id" : "ChIJbZ6z_rhYNDER1lQxQTBnkvU",
                  "types" : [ "route" ]
               }
            ],
            "routes" : [
               {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 21.1111346,
                        "lng" : 105.5204902
                     },
                     "southwest" : {
                        "lat" : 21.0045488,
                        "lng" : 105.4959718
                     }
                  },
                  "copyrights" : "Map data ©2020",
                  "legs" : [
                     {
                        "distance" : {
                           "text" : "15.1 km",
                           "value" : 15139
                        },
                        "duration" : {
                           "text" : "28 mins",
                           "value" : 1689
                        },
                        "end_address" : "Tích Giang, Phúc Thọ, Hà Nội, Vietnam",
                        "end_location" : {
                           "lat" : 21.1111346,
                           "lng" : 105.5155725
                        },
                        "start_address" : "Unnamed Road, Thạch Hoà, Thạch Thất, Hà Nội, Vietnam",
                        "start_location" : {
                           "lat" : 21.0045488,
                           "lng" : 105.5129164
                        },
                        "steps" : [
                           {
                              "distance" : {
                                 "text" : "0.3 km",
                                 "value" : 260
                              },
                              "duration" : {
                                 "text" : "1 min",
                                 "value" : 51
                              },
                              "end_location" : {
                                 "lat" : 21.0068315,
                                 "lng" : 105.5124509
                              },
                              "html_instructions" : "Head \u003cb\u003enorth\u003c/b\u003e",
                              "polyline" : {
                                 "points" : "mme_Cw~~bSSBM@oALe@FeBLC?yAPcAHSHSL"
                              },
                              "start_location" : {
                                 "lat" : 21.0045488,
                                 "lng" : 105.5129164
                              },
                              "travel_mode" : "DRIVING"
                           },
                           {
                              "distance" : {
                                 "text" : "0.9 km",
                                 "value" : 923
                              },
                              "duration" : {
                                 "text" : "3 mins",
                                 "value" : 188
                              },
                              "end_location" : {
                                 "lat" : 21.0114661,
                                 "lng" : 105.5186561
                              },
                              "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003ePass by Trung tâm FU Hub (on the left in 800&nbsp;m)\u003c/div\u003e",
                              "maneuver" : "turn-right",
                              "polyline" : {
                                 "points" : "u{e_Cy{~bS{@c@cAmAw@aA{@gAGIyAmB{@{@OIuBu@OGeDkAaAc@a@[YY{@oAs@oAUc@EMAAAECOCQAU@e@RqAZ_BJo@Fa@"
                              },
                              "start_location" : {
                                 "lat" : 21.0068315,
                                 "lng" : 105.5124509
                              },
                              "travel_mode" : "DRIVING"
                           },
                           {
                              "distance" : {
                                 "text" : "11.6 km",
                                 "value" : 11561
                              },
                              "duration" : {
                                 "text" : "18 mins",
                                 "value" : 1078
                              },
                              "end_location" : {
                                 "lat" : 21.1074801,
                                 "lng" : 105.4959718
                              },
                              "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e at Đại Lí Tranh Đá Quốc Vượng onto \u003cb\u003eQL21A\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003ePass by Quán Cây Xăng (on the right)\u003c/div\u003e",
                              "maneuver" : "turn-left",
                              "polyline" : {
                                 "points" : "uxf_Csb`cSo@GwJiAaDc@wAMeDc@_M{AeFk@m@GA?c@Ea@GYCIAc@G_@C_AG}CI_@?qBC_BBW@wBJU@gAJcALa@FG@[Dy@LmAVuA\\GBWFa@La@LA?_@L_@La@Na@LUFID[Lq@\\uCtAq@\\]PUNyDrB_Ad@sC`Bc@TuCzAiHvDgAn@}JrF{CbBc@TqAn@}CjAw@V}Bx@kC|@KDaEvBsCfBaC~Am@`@wGlEeBhA_IpFe@\\gBpAgBhA_BjAg@^eBhA{Av@]RyAbAIFkCvB_FzCu@d@WPaAn@sA`AqBzAaCjBw@d@uEvCgD|BYP[Ru@f@[T}AbAw@f@YP_@P]PeBp@eA\\qCv@}Bn@sA^eBh@WD}B^q@Fk@Dk@Bo@?aAEm@EiAMUEyAY}@UA?w@Ui@MaAW_AYaBc@kCu@w@Uy@ScAYo@S{@SgA[{JoC{DeA_FuAm@Q{C{@eAW{AWg@Ik@GqAOmAMkGu@qAMm@GaFm@C?{C[{AQeCWmFo@yCYQAmAGi@Au@Aw@@Q?aADM?aBNc@Fa@HWDa@LkBd@y@Zy@\\wBbAwAl@gAb@eBv@wFtBg@Tm@VyAl@yBz@y@ZIB{@`@[Lw@T]Lw@XODgBZ}@Ps@HkANQBq@HqCTA?wEb@]BmCVyFd@_AJ{@FKAY?_F^cEf@i@Fa@HgInAkCd@a@JmAT}@NqCb@yGdAaANIBuDn@"
                              },
                              "start_location" : {
                                 "lat" : 21.0114661,
                                 "lng" : 105.5186561
                              },
                              "travel_mode" : "DRIVING"
                           },
                           {
                              "distance" : {
                                 "text" : "0.3 km",
                                 "value" : 320
                              },
                              "duration" : {
                                 "text" : "1 min",
                                 "value" : 76
                              },
                              "end_location" : {
                                 "lat" : 21.1081628,
                                 "lng" : 105.4988866
                              },
                              "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e",
                              "maneuver" : "turn-right",
                              "polyline" : {
                                 "points" : "wpy_Cyt{bS[sBCO?GG]EUGSCIGMGIAGCGAICIG_@E]AM?KAKAMACAECACCAACCCGCGAOEW?c@EW?O?K@IFK"
                              },
                              "start_location" : {
                                 "lat" : 21.1074801,
                                 "lng" : 105.4959718
                              },
                              "travel_mode" : "DRIVING"
                           },
                           {
                              "distance" : {
                                 "text" : "0.2 km",
                                 "value" : 154
                              },
                              "duration" : {
                                 "text" : "1 min",
                                 "value" : 43
                              },
                              "end_location" : {
                                 "lat" : 21.1095024,
                                 "lng" : 105.4992654
                              },
                              "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e toward \u003cb\u003eTích Giang\u003c/b\u003e",
                              "maneuver" : "turn-left",
                              "polyline" : {
                                 "points" : "_uy_Cag|bSG?IEc@Ik@KwAUqAY"
                              },
                              "start_location" : {
                                 "lat" : 21.1081628,
                                 "lng" : 105.4988866
                              },
                              "travel_mode" : "DRIVING"
                           },
                           {
                              "distance" : {
                                 "text" : "1.6 km",
                                 "value" : 1587
                              },
                              "duration" : {
                                 "text" : "4 mins",
                                 "value" : 214
                              },
                              "end_location" : {
                                 "lat" : 21.1090811,
                                 "lng" : 105.5132278
                              },
                              "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eTích Giang\u003c/b\u003e",
                              "maneuver" : "turn-right",
                              "polyline" : {
                                 "points" : "k}y_Cmi|bSTy@FQJUXk@N]FIPa@HSBI?CFM@M?[McAC[OiEEe@IYIk@Gw@?CIa@GOQYWa@Uo@E[Ee@y@mFM_A?K?OBQHSf@eAn@uAl@yBDgAIaAQyACQA_BE[Mc@iAuBOYyAcDD[`AmAVa@h@}@`AqBr@}AFY"
                              },
                              "start_location" : {
                                 "lat" : 21.1095024,
                                 "lng" : 105.4992654
                              },
                              "travel_mode" : "DRIVING"
                           },
                           {
                              "distance" : {
                                 "text" : "0.3 km",
                                 "value" : 334
                              },
                              "duration" : {
                                 "text" : "1 min",
                                 "value" : 39
                              },
                              "end_location" : {
                                 "lat" : 21.1111346,
                                 "lng" : 105.5155725
                              },
                              "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e to stay on \u003cb\u003eTích Giang\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the left\u003c/div\u003e",
                              "maneuver" : "turn-left",
                              "polyline" : {
                                 "points" : "wzy_Cu`_cSqCeDsBaCCAKQcCwC"
                              },
                              "start_location" : {
                                 "lat" : 21.1090811,
                                 "lng" : 105.5132278
                              },
                              "travel_mode" : "DRIVING"
                           }
                        ],
                        "traffic_speed_entry" : [],
                        "via_waypoint" : []
                     }
                  ],
                  "overview_polyline" : {
                     "points" : "mme_Cw~~bSwCZiBL}CZg@V{@c@cAmAsBiCaBwBkAeAeC}@eDkAaAc@{@u@{@oAs@oA[q@Ki@AU@e@n@qDRqAgLqAyFq@eR_CyHy@iBU_BK}DIqBC_BBoCL}ALeBTkDl@wCv@gEtAuG~Cs@`@yFxCwDvB_MrGeS|KqAn@}CjAuDpAwCbAaEvBsCfBoD`C}JvGeJnGgBpAgBhAgCjBeBhA{Av@wBvAuC~BoJbGeE|CaCjBw@d@uEvCgD|Bu@d@gFhDy@b@cCbAiLdD}Bn@}B^q@FwAHqBEwBSoB_@aDy@oJkCqBi@sBm@cCo@wPuEoN{DcCa@}BWyIcA_CU}M{AsJgAkD[wBImB?sADoBNeAPy@RkBd@y@ZqD`B_DpAeBv@wFtBuAl@sEhBcA^wAn@}CbAeDl@_CXcALsCT}RdB{BRe@A_F^cEf@kAPgInAkCd@oB`@kPhC_Er@_@cCUoAUi@Q{@IcAIYMQEWE{@Eg@@UFKG?m@OcCa@qAYTy@Rg@h@iAXk@L]FQ@i@Q_BUoFSeAG{@Qq@i@{@Uo@E[Ee@y@mFMkABa@p@yAn@uAl@yBDgAIaAUkBA_BE[Mc@iAuBiB}DD[`AmA`A_BtBoEFYeGgHsCkD"
                  },
                  "summary" : "QL21A",
                  "warnings" : [],
                  "waypoint_order" : []
               }
            ],
            "status" : "OK"
         });
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

        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = e => {
        // const google = window.google;
        // const directionsService = new google.maps.DirectionsService();
        //     const origin = {lat:21.099870,lng:105.619660};
        //     const destination = {lat:22.099870,lng:105.619660};
        //     directionsService.route(
        //         {
        //             origin: origin,
        //             destination: destination,
        //             travelMode: google.maps.TravelMode.DRIVING
        //         },
        //         (result, status) => {
        //             if (status === google.maps.DirectionsStatus.OK) {
        //                 console.log(result?.routes?.[0]?.legs?.[0]);
        //                 setDirections(result);
                    
        //             } else {
        //                 console.error(`error fetching directions ${result}`);
        //             }
        //         }
        //     );

        setVisible(false);
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
                {/* {markers.map((marker) => (
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
                ))} */}
                {console.log(directions)}
                <DirectionsRenderer directions={directions} />

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