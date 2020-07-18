import React, { Component,useState, useEffect } from "react";
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
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
    
        const google = window.google;

      const directionsService = new google.maps.DirectionsService();

      const origin = { lat: 21.0277644, lng:105.8341598 };
      const destination = { lat: 21.0277644, lng:106.8341598 };

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            console.log(result);
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
    defaultZoom={7}
    defaultCenter={new window.google.maps.LatLng(21.0277644, 105.8341598)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>

);


const MapWith = (props) => {

    const [patientAddress, setPatientAddress] = useState({});
    const [doctorAddress, setDoctorAddress] = useState({});
    const [ready, setReady] = useState(false);
    const [distance, setDistance] = useState(-1);
    const [directions, setDirections] = useState({});


    useEffect(() => {
        let { lat, lng } = props.doctorAddress;
        console.log(props)
        console.log({ lat, lng });
        console.log(props.patientAddress);
        setPatientAddress(props.patientAddress);
        setDoctorAddress({ lat, lng });

    }, [])

    // useEffect(() => {
    //         setReady(true);
    // }, [patientAddress]);
    const rad = (x) => {
        return x * Math.PI / 180;
    };

    const getDistance = (p1, p2) => {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2?.lat - p1?.lat);
        var dLong = rad(p2?.lng - p1?.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };

    return (
        <div>

            {/* {getDistance(p1, p2)} */}
            <MapWithADirectionsRenderer />

        </div>
    );

}



export default MapWith;