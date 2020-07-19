import React, { Component, useState, useEffect, useSelector } from "react";
import { Spin, Button, Modal } from 'antd';
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} = require("react-google-maps");


const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `300px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const google = window.google;
      const directionsService = new google.maps.DirectionsService();

      const origin = this.props.patientAddress;
      const destination = this.props.doctorAddress;

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.props.getDirectionInfo(result?.routes?.[0]?.legs?.[0].distance.text, result?.routes?.[0]?.legs?.[0].duration.text)
            this.setState({
              directions: result
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );

    }
  })
)(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={new window.google.maps.LatLng(21.0277644, 105.8341598)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>

);


const Map = (props) => {

  const [patientAddress, setPatientAddress] = useState({});
  const [doctorAddress, setDoctorAddress] = useState({});
  const [direction, setDirection] = useState({ distance: "", time: "" });
  const [ready, setReady] = useState(false);
  // const { isLoad } = useSelector(state => state.ui);

  const size = (obj) => {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  useEffect(() => {
    console.log(props);
    let { lat, lng } = props.doctorAddress;
    setPatientAddress(props.patientAddress);
    setDoctorAddress({ lat, lng });

  }, []);

  useEffect(() => {
    if (size(patientAddress) > 0 && size(doctorAddress) > 0)
      setReady(true);
  }, [patientAddress, doctorAddress]);

  const getDirectionInfo = (distance, time) => {
    setDirection({ distance, time });
  }

  const formatTime = (value) => {
    return value.match(/\d+/)[0];
  }

  return (
    <Modal
      title="Thông tin bệnh nhân"
      visible={props.visible}
      onCancel={props.handleCancel}

      handle={props.handleCancel}
      footer={[
        <Button onClick={props.handleCancel}>Quay lại</Button>
      ]}
    >
      <div>
        {/* <Spin size="large" spinning={isLoad}  > */}
          <div className="map-distance-div">

            <div className="direction-distance-div">Khoảng cách từ chỗ bạn đến chỗ bác sĩ: <p>{direction.distance}</p></div>
            <div className="direction-time-div">Thời gian đi bằng xe máy: {direction.time} </div>
            {ready && <MapWithADirectionsRenderer patientAddress={patientAddress} doctorAddress={doctorAddress} getDirectionInfo={getDirectionInfo} />}

          </div>
        {/* </Spin> */}
      </div>
    </Modal>
  );

}



export default Map;