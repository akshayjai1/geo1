/* global google */
import React, {Component} from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Map from './Map';
import './App.css';
import MapWithASearchBox from './MapWithSearchBox';
import { withProps } from 'recompose';
import { MapConfig } from './constants/MapConstants';
import { setCenter } from './actions/MapActions/MapActions';
const MapWithProps = withProps(MapConfig)(Map);
class App extends Component {
  constructor(props) {
    super(props);
    console.log('this is props.center',props.center);
    this.state = {
      center: props.center,
      content: 'Getting position...',
      insideFence: false,
      previousPolygon: null,
      fence: null,
      watchID: null,
      lastFetched: null,
    };
  }

  componentDidMount() {
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

      navigator.geolocation.watchPosition(this.getLocation.bind(this), null, geoOptions);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  unwatchLocation() {
    if ('geolocation' in navigator && this.state.watchID) {
      navigator.geolocation.clearWatch(this.state.watchID);
    }
  }

  getLocation(position) {
    const center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    console.log('calling setCenter props on ',this.props,' with center ',center);
    this.props.setCenterProp(center);
    this.setState({
      center,
      content: `Location found.`,
      lastFetched: position.timestamp,
    });

    this.checkGeofence();
  }

  checkGeofence() {
    if (!this.state.fence) {
      this.setState({
        insideFence: false,
      });
      return;
    }

    const insideFence = google.maps.geometry.poly
      .containsLocation(this.getCurrentPosition(), this.state.fence);

    this.setState({
      insideFence,
    });
  }
  printPolygonVertices = (pathObj) => {
    console.log('printing polygon vertices');
    let polygon = pathObj.j[0].j;
    for( let vertex of polygon) {
      console.log(vertex.lat(),vertex.lng());
    }
  }
  doneDrawing(polygon) {
    if (this.state.previousPolygon) {
      this.state.previousPolygon.setMap(null);
    }

    this.setState({previousPolygon: polygon});
    console.log('this is polygon',polygon);
    const options = {
      editable: true,
      draggable: true,
      opacity: 0,
      strokeOpacity: 0.5,
      strokeColor: '#00ffa0',
      strokeWeight: 3,
      fillOpacity:0,
    }
    polygon.setOptions(options);
    const customPolygon1 = [
      {lat:14,lng:80},
      {lat:13,lng:80},
      {lat:14,lng:81},
    ];
    const customPolygon2 = [
      {lat:14,lng:80},
      {lat:13,lng:81},
      {lat:14,lng:81},
    ]
    const customPolygons = [customPolygon1,customPolygon2];
    polygon.setPaths(customPolygons);
    console.log('inside function done drawing, these are polygon vertices, ', polygon.getPaths());
    console.log('inside function done drawing, these are polygon vertices, ', polygon.getPath());
    this.printPolygonVertices(polygon.getPaths());
    this.setState({
      fence: new google.maps.Polygon({
        paths: polygon.getPaths(),
      }),
    });

    this.checkGeofence();
  }

  getCurrentPosition() {
    const currentPosition = new google.maps.LatLng(this.state.center.lat, this.state.center.lng);
    return currentPosition;
  }

  render() {
    console.log('inside the render method of app, this is props', this.props);
    let map = null;
    let fenceStatus = null;

    if (this.state.fence) {
      if (this.state.insideFence) {
        fenceStatus = <p>You are inside the fence.</p>;
      } else {
        fenceStatus = <p>You are outside the fence.</p>;
      }
    }

    if (this.state.lastFetched) {
      map = (<div>
        <p>
          Last fetched: <Moment interval={10000} fromNow>{this.state.lastFetched}</Moment>
        </p>
        <MapWithProps
          center={this.state.center}
          content={this.state.content}
          doneDrawing={this.doneDrawing.bind(this)}
        />
        {/* <MapWithASearchBox/> */}
      </div>);
    } else {
      map = <p>Getting location...</p>;
    }

    return (
      <div className="App">
        {map}
        {fenceStatus}
      </div>
    );
  }
}
const mapStateToProps = (props)=>{
  console.log('inside mapStateToProps function of App.js, this is passed in props',props);
  return {
    center: props.MapReducer.center,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCenterProp : center => {
      dispatch(setCenter(center));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
