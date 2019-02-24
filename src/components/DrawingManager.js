/* global google */
import React, { useRef, useState, useCallback } from 'react';
import { withGoogleMap, GoogleMap, Marker, withScriptjs } from 'react-google-maps';
import { compose, lifecycle } from 'recompose';
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import { searchInput } from './styles/styled-components';
import { onPlacesChanged } from './utils/MapUtils';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");


const GoogleMap1 = props => {
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef("");  
  const searchRef = useRef("");
  const onBoundsChanged = () => {
    console.log("inside onBoundsChanged function of drawingManager, this is the value of this",this);
    console.log('inside DrawingManager onBoundsChanged, this is center',mapRef.current.getCenter());
    const cent = mapRef.current.getCenter()
    console.log('dispatching bounds as ',mapRef.current.getBounds());
  }
  
  return (
  <GoogleMap
    defaultZoom={15}
    center={props.center}
    ref={mapRef}
    onBoundsChanged={onBoundsChanged}
  >
    <DrawingManager
      defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
      }}
      onPolygonComplete={props.doneDrawing}
    />
    {props.center.lat && props.center.lng && (
      <Marker position={props.center} />
    )}
    {markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
)
    }
const withLife = lifecycle({
  componentWillMount() {
    const refs = {}

    this.setState({
      markers: [],
      // onMapMounted: ref => {
      //   console.log('inside onMapMounted setting ref to ',ref);
      //   refs.map = ref;
      // },
      onBoundsChanged: () => {
        console.log("inside onBoundsChanged function of drawingManager, this is the value of this",this);
        // console.log('inside DrawingManager onBoundsChanged, this is center',refs.map.getCenter());
        // const cent = mapRef.map.getCenter()
        // this.props.setCenterProp({
        //   center: {
        //     lat: cent.lat(),lng: cent.lng()
        //   }
        // })
        // this.props.setBoundsProp(refs.map.getBounds());
        console.log('dispatching bounds as ',refs.map.getBounds());
        // this.setState({
        //   bounds: refs.map.getBounds(),
        //   center: refs.map.getCenter(),
        // })
      },
      onSearchBoxMounted: ref => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        console.log('inside DrawingManager onPlace changed');
        const places = refs.searchBox.getPlaces();
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
        const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
        console.log('after changing place in drawing manager this is the new center', nextCenter);
        const cent = refs.map.getCenter();
        this.props.setCenterProp({
            center: {
              lat: cent.lat(),lng: cent.lng()
            }
        });
        this.props.setMarkersProp(nextMarkers)
        // refs.map.fitBounds(bounds);
      },
    })
  },
})
export default compose(withLife, withScriptjs, withGoogleMap)(GoogleMap1);
/**
 * 
 *  
    <SearchBox
      ref={searchRef}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={useCallback(()=> {onPlacesChanged({
        searchRef,google,setMarkers,setCenter:props.setCenterProp,currentCenter: props.center
      })})}
    >
      <input className={"search-box-input"} type="text"
        placeholder="Customized your placeholder"/>
      />
    </SearchBox>
    {props.center.lat && props.center.lng && (
      <Marker position={props.center} />
    )}
    {markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
 */