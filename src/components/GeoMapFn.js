/* global google */
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { connect } from 'react-redux';
import Map from './DrawingManager';
import { PolygonOptions } from '../constants/MapConstants';
import { setCenter, setWatchId, setInsideFence, setPolygon, setFence, setBounds, setMarkers } from '../actions/MapActions/MapActions';

import GoogleMapLoadingProps from '../constants/GoogleMapLoadingProps';
import LastFetched from './LastFetched';

const MapWithProps = GoogleMapLoadingProps(Map);

const GeoMapFn = (props) => {
    const [watchId, setWatchId] = useState(null);
    const [mapStatus, setMapStatus] = useState('Getting Position...');
    const [mapTimeStamp, setMapTimeStamp] = useState(null);
    const [insideFence, setInsideFence] = useState(null);

    
    const unwatchLocation = () => {
        if ('geolocation' in navigator && watchId) {
          console.log('clearing watch');
          navigator.geolocation.clearWatch(watchId);
        }
    }

    const watchLocation = () => {
        if ('geolocation' in navigator) {
            const geoOptions = {
              enableHighAccuracy: true,
              maximumAge : 30000,
              timeout : 27000
            };
            console.log('about to watch location');
            const watchId = navigator.geolocation.watchPosition(setLocation, null, geoOptions);
            setWatchId(watchId);
            props.setWatchIdProp(watchId);
            console.log('this is watch Id',watchId,this);
          } else {
            alert('Geolocation is not supported by this browser.');
          }
    }

    useEffect(()=> {
        watchLocation();
        return () => {
            unwatchLocation();
        }
    },[])
    
    const setLocation = (position) => {
        console.log('setting location');
        setMapStatus('Location found');
        setMapTimeStamp(position.timestamp);
        const centerDetail = {
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        console.log('calling setCenter props on ',props,' with center ',centerDetail);
        props.setCenterProp(centerDetail);
        checkGeofence();
      }
    
      const checkGeofence = () => {
        console.log('inside fn checkGeoFence');
        if (!props.fence) {
          return;
        }
        const insideFence = google.maps.geometry.poly
          .containsLocation(getCurrentPosition(), props.fence);
        setInsideFence(insideFence);
        props.setInsideFenceProp(insideFence);
      }
      const printPolygonVertices = (pathObj) => {
        console.log('printing polygon vertices');
        let polygon = pathObj.j[0].j;
        for( let vertex of polygon) {
          console.log(vertex.lat(),vertex.lng());
        }
      }
      const doneDrawing = (polygon) => {
        if (props.previousPolygon) {
          props.previousPolygon.setMap(null);
        }
        props.setPolygonProp(polygon);
        // this.setState({previousPolygon: polygon});
        console.log('this is polygon',polygon);
        polygon.setOptions(PolygonOptions);
        // polygon.setPaths(this.props.polygons);
        console.log('inside function done drawing, these are polygon vertices, ', polygon.getPaths());
        printPolygonVertices(polygon.getPaths());
        // this.setState({
        //   fence: new google.maps.Polygon({
        //     paths: polygon.getPaths(),
        //   }),
        // });
        props.setFenceProp(new google.maps.Polygon({
          paths: polygon.getPaths(),
        }) );
        checkGeofence();
      }
    
      const getCurrentPosition = () => {
        const { center } = props;
        const currentPosition = new google.maps.LatLng(center.lat, center.lng);
        // const currentPosition = this.props.center;
        console.log('returning current position',currentPosition);
        return currentPosition;
      }
    
      console.log('inside the render method of GeoMap, this is props', props);
      let map = null;
      let fenceStatus = null;
  
      if (props.fence) {
        if (insideFence) {
          fenceStatus = <p>You are inside the fence.</p>;
        } else {
          fenceStatus = <p>You are outside the fence.</p>;
        }
      }
  
      if (mapTimeStamp) {
        map = (<div>
          <LastFetched mapTimeStamp={mapTimeStamp} />
          <MapWithProps
            {...props}
            center={props.center}
            content={props.content}
            doneDrawing={doneDrawing}
          />
        </div>);
      } else {
        map = <p>{mapStatus}</p>;
      }
  
      return (
        <div className="GeoMapFn">
          {map}
          {fenceStatus}
        </div>
      );
}

const mapStateToProps = (state)=>{
    console.log('inside mapStateToProps function of App.js, this is passed in state',state);
    const { center, fence, previousPolygon } = state.MapReducer;
    const { polygons } = state.MapReducer.polygonDetail;
    return { center, fence, previousPolygon, polygons };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      setCenterProp : centerDetail => {
        dispatch(setCenter(centerDetail));
      },
      setWatchIdProp: watchId => {
        dispatch(setWatchId(watchId))
      },
      setInsideFenceProp: insideFence => {
        dispatch(setInsideFence(insideFence));
      },
      setFenceProp: fence => {
        dispatch(setFence(fence));
      },
      setPolygonProp: polygon => {
        dispatch(setPolygon(polygon));
      },
      setBoundsProp: bounds => {
        dispatch(setBounds(bounds));
      },
      setMarkersProp: markers => {
        dispatch(setMarkers(markers));
      }
    }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(GeoMapFn);