/* global google */
import React from 'react';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  withScriptjs
} from 'react-google-maps';
import { compose, lifecycle } from 'recompose';
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");
const GoogleMap1 = props => (
  <GoogleMap
    defaultZoom={15}
    center={props.center}
    ref={props.onMapMounted}
    onBoundsChanged={props.onBoundsChanged}
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
    {props.center.lat && props.center.lng && (
      <Marker position={props.center} />
    )}
  </GoogleMap>
)
const withLife = lifecycle({
  componentWillMount() {
    const refs = {}

    this.setState({
      markers: [],
      onMapMounted: ref => {
        console.log('inside onMapMounted setting ref to ',ref);
        refs.map = ref;
      },
      onBoundsChanged: () => {
        console.log("inside onBoundsChanged function of drawingManager, this is the value of this",this);
        console.log('inside DrawingManager onBoundsChanged, this is center',refs.map.getCenter());
        const cent = refs.map.getCenter()
        this.props.setCenterProp({
          center: {
            lat: cent.lat(),lng: cent.lng()
          }
        })
        this.props.setBoundsProp(refs.map.getBounds());
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
        // this.setState({
        //   center: nextCenter,
        //   markers: nextMarkers,
        // });
        // refs.map.fitBounds(bounds);
      },
    })
  },
})
export default compose(withLife, withScriptjs, withGoogleMap)(GoogleMap1);
