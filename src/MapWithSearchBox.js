import React from 'react';
import { googleMapURL } from './constants/MapConstants';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import GoogleMapWithSearch from './GoogleMapWithSearch';
const _ = require("lodash");
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
        onPlacesChanged: (setCenterSearchProp,setMarkersSearchProp) => {
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
          // this.props.setCenterSearchProp({
          setCenterSearchProp({
            center: nextCenter
          })
          // this.props.setMarkersSearchProp({
          setMarkersSearchProp({
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
)(GoogleMapWithSearch);
 

export default MapWithASearchBox;
