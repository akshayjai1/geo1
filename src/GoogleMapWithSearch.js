import React from 'react';
import { connect } from 'react-redux';
import { GoogleMap, Marker } from 'react-google-maps';

import { setCenterSearch, setMarkersSearch } from './actions/SearchActions';

const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const google = window.google = window.google ? window.google : {}

const GoogleMapWithSearch = props => {
    console.log('rendering google map with only search box',this,props);
    return <GoogleMap
    defaultZoom={15}
    center={props.center}
    ref={props.onMapMounted}
    onBoundsChanged={props.onBoundsChanged}
    markers={props.markers}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged.bind(null,props.setCenterSearchProp,props.setMarkersSearchProp)}
    >
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index,arr) =>{
      console.log('mapping markerrs');
      return <Marker key={index} position={marker.position} /> 
    }
    )}
  </GoogleMap>
  }

  const mapStateToProps = (state) => {
    console.log('this is the state received in map state to props of MapWithaSearchBox', state)
    const {center, content, lastFetched, markers, bounds } = state.SearchReducer
    return {
      center, content, lastFetched, markers, bounds
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    console.log('inside map dispatch to props connected with MapWithASearchBox',dispatch);
    return {
      setCenterSearchProp: (centerDetail) => {
        dispatch(setCenterSearch(centerDetail));
      },
      setMarkersSearchProp: (markers) => {
        dispatch(setMarkersSearch(markers));
      }
    }
  }
  export default connect(mapStateToProps,mapDispatchToProps)(GoogleMapWithSearch);