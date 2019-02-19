/* global google */
import React, {Component} from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Map from './DrawingManager';
import { withProps } from 'recompose';
import { MapConfig, PolygonOptions } from '../constants/MapConstants';
import { setCenter, setWatchId, setInsideFence, setPolygon, setFence, setBounds, setMarkers } from '../actions/MapActions/MapActions';

const MapWithProps = withProps(MapConfig)(Map);
class GeoMap extends Component {
  constructor(props) {
    super(props);
    console.log('this is props.center, in GeoMap ',props.center);
  }

  componentDidMount() {
    console.log('inside component did mount of GeoMap');
    this.watchLocation();
  }

  componentWillUnmount() {
    this.unwatchLocation();
  }

  watchLocation() {
    if ('geolocation' in navigator) {
      const geoOptions = {
        enableHighAccuracy: true,
        maximumAge : 30000,
        timeout : 27000
      };
      console.log('about to watch location');
      const watchId = navigator.geolocation.watchPosition(this.setLocation, null, geoOptions);
      this.props.setWatchIdProp(watchId);
      console.log('this is watch Id',watchId,this);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  unwatchLocation() {
    if ('geolocation' in navigator && this.props.watchID) {
      console.log('clearing watch');
      navigator.geolocation.clearWatch(this.props.watchID);
    }
  }

  setLocation = (position) => {
    console.log('setting location');
    const centerDetail = {
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      content: `Location found.`,
      lastFetched: position.timestamp,
    };
    console.log('calling setCenter props on ',this.props,' with center ',centerDetail);
    this.props.setCenterProp(centerDetail);
    this.checkGeofence();
  }

  checkGeofence = () => {
    console.log('inside fn checkGeoFence');
    if (!this.props.fence) {
      return;
    }
    const insideFence = google.maps.geometry.poly
      .containsLocation(this.getCurrentPosition(), this.props.fence);
    this.props.setInsideFenceProp(insideFence);
  }
  printPolygonVertices = (pathObj) => {
    console.log('printing polygon vertices');
    let polygon = pathObj.j[0].j;
    for( let vertex of polygon) {
      console.log(vertex.lat(),vertex.lng());
    }
  }
  doneDrawing = (polygon) => {
    if (this.props.previousPolygon) {
      this.props.previousPolygon.setMap(null);
    }
    this.props.setPolygonProp(polygon);
    // this.setState({previousPolygon: polygon});
    console.log('this is polygon',polygon);
    polygon.setOptions(PolygonOptions);
    // polygon.setPaths(this.props.polygons);
    console.log('inside function done drawing, these are polygon vertices, ', polygon.getPaths());
    this.printPolygonVertices(polygon.getPaths());
    // this.setState({
    //   fence: new google.maps.Polygon({
    //     paths: polygon.getPaths(),
    //   }),
    // });
    this.props.setFenceProp(new google.maps.Polygon({
      paths: polygon.getPaths(),
    }) );
    this.checkGeofence();
  }

  getCurrentPosition() {
    const { center } = this.props;
    const currentPosition = new google.maps.LatLng(center.lat, center.lng);
    // const currentPosition = this.props.center;
    console.log('returning current position',currentPosition);
    return currentPosition;
  }

  render() {
    console.log('inside the render method of GeoMap, this is props', this.props);
    let map = null;
    let fenceStatus = null;

    if (this.props.fence) {
      if (this.props.insideFence) {
        fenceStatus = <p>You are inside the fence.</p>;
      } else {
        fenceStatus = <p>You are outside the fence.</p>;
      }
    }

    if (this.props.lastFetched) {
      map = (<div>
        <p>
          Last fetched: <Moment interval={10000} fromNow>{this.props.lastFetched}</Moment>
        </p>
        <MapWithProps
          {...this.props}
          center={this.props.center}
          content={this.props.content}
          doneDrawing={this.doneDrawing}

        />
        {/* <MapWithASearchBox/> */}
      </div>);
    } else {
      map = <p>Getting location...</p>;
    }

    return (
      <div className="GeoMap">
        {map}
        {fenceStatus}
      </div>
    );
  }
}
const mapStateToProps = (props)=>{
  console.log('inside mapStateToProps function of App.js, this is passed in props',props);
  const { center, content, lastFetched, fence, insideFence, previousPolygon, watchID } = props.MapReducer;
  const { polygons } = props.MapReducer.polygonDetail;
  return { center, content, lastFetched, fence, insideFence, previousPolygon, watchID, polygons };
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
export default connect(mapStateToProps, mapDispatchToProps)(GeoMap);
