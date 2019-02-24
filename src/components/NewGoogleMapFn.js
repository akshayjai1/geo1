import React from 'react';
import { googleMapURL } from '../constants/MapConstants';
const scriptjs = require('scriptjs');

const google = window.google = window.google ? window.google : {}

const NewGoogleMapFn = (props) => {
  const newMapRef = React.useRef("");
  const myLatLng = {lat: -34.397, lng: 150.644};
  var map;
  const markPoint = {
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  }
  React.useEffect(()=>{
    scriptjs(googleMapURL, 'google',() => {
      map = new google.maps.Map(newMapRef.current, {
        center: myLatLng,
        zoom: 8
      });
      // var marker = new google.maps.Marker(markPoint)
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
      })
    });
  },[])
  return (
    <div id="newMap" style={{height:"100vh"}} ref={newMapRef}>

    </div>
  )
}
export default NewGoogleMapFn;