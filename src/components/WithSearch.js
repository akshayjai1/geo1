import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const google = window.google = window.google ? window.google : {}
const searchInput = styled.input`
          box-sizing: border-box;
          border: 1px solid transparent;
          width: 240px;
          height: 32px;
          margin-top: 27px;
          padding: 0 12px;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);,
          font-size: 14px;
          outline: none;
          text-overflow: ellipses;`
const WithSearch = (props) => {
  const searchRef = useRef("");
  const [center, setCenter] = useState({
    lat: 41.9, lng: -87.624
  });
  const [bounds, setBounds] = useState(null);
  const [markers, setMarkers] = useState([]);

  const onPlacesChanged = () => {
    console.log('on places changed called');
    const places = searchRef.getPlaces();
    console.log('these are the places',places);
    const bounds = new google.maps.LatLngBounds();

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    });
    const nextMarkers = places.map(place => ({
      position: place.geometry.location,
    }));
    const nextCenter = _.get(nextMarkers, '0.position', center);
    console.log('setting new center and new marker');
    setCenter(nextCenter);
    setMarkers(nextMarkers);
    // refs.map.fitBounds(bounds);
  }
  return (
    <React.Fragment>
    <SearchBox
      ref={searchRef}
      bounds={bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={onPlacesChanged}
    >
      <searchInput
        type="text"
        placeholder="Customized your placeholder"
      />
    </SearchBox>
    {markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
    </React.Fragment>
  )
}

{/* <MapWithASearchBox /> */}
export default WithSearch;
