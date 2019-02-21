import React from 'react';
import { googleMapURL } from './constants/MapConstants';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { connect } from 'react-redux';
import { setCenterSearch, setMarkersSearch } from './actions/SearchActions';
const _ = require("lodash");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const google = window.google = window.google ? window.google : {}
const MapWithASearchBox = compose(
  withProps({
    googleMapURL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount(props) {
      console.log('inside component will mount of mapwithsearchbox, this are the arguments and this', arguments,this);
      const refs = {}
      console.log('this is the value of this in componentWillMount of MapWithSearchbox',this);
      this.setState({
        // bounds: null,
        // center: {
        //   lat: 41.9, lng: -87.624
        // },
        markers: this.props.markers,
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          console.log("inside onBoundsChanged function, this is the value of this",this);
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          console.log('after place changed, these is bounds and places', bounds, places)
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
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          console.log('this is new center and marker ', nextCenter, nextMarkers);
          this.props.setCenterSearchProp({
            center: nextCenter
          })
          this.props.setMarkersSearchProp({
            markers: nextMarkers
          })
          // this.setState({
          //   center: nextCenter,
          //   markers: nextMarkers,
          // });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => {
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
    onPlacesChanged={props.onPlacesChanged}
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
  
);

{/* <MapWithASearchBox /> */}
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
export default connect(mapStateToProps,mapDispatchToProps)(MapWithASearchBox);
