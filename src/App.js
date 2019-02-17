/* global google */
import React, {Component} from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Map from './Map';
import './App.css';
import MapWithASearchBox from './MapWithSearchBox';
import { withProps } from 'recompose';
import { MapConfig, PolygonOptions } from './constants/MapConstants';
import { setCenter, setWatchId, setInsideFence } from './actions/MapActions/MapActions';
const MapWithProps = withProps(MapConfig)(Map);
class App extends Component {
  constructor(props) {
    super(props);
    console.log('this is props.center',props.center);
    // this.state = {
    //   center: props.center,
    //   content: props.content,
    //   insideFence: false,
    //   previousPolygon: null,
    //   fence: props.fence,
    //   watchID: null,
    //   lastFetched: props.lastFetched,
    // };
  }

  componentDidMount() {
    console.log('inside component did mount');
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

  checkGeofence() {
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
    if (this.state.previousPolygon) {
      this.state.previousPolygon.setMap(null);
    }

    this.setState({previousPolygon: polygon});
    console.log('this is polygon',polygon);
    
    polygon.setOptions(PolygonOptions);
    polygon.setPaths(this.props.polygons);
    console.log('inside function done drawing, these are polygon vertices, ', polygon.getPaths());
    this.printPolygonVertices(polygon.getPaths());
    this.setState({
      fence: new google.maps.Polygon({
        paths: polygon.getPaths(),
      }),
    });

    this.checkGeofence();
  }

  getCurrentPosition() {
    // const currentPosition = new google.maps.LatLng(this.state.center.lat, this.state.center.lng);
    const currentPosition = this.props.center;
    console.log('returning current position',currentPosition);
    return currentPosition;
  }

  render() {
    console.log('inside the render method of app, this is props', this.props);
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
      <div className="App">
        {map}
        {fenceStatus}
      </div>
    );
  }
}
const mapStateToProps = (props)=>{
  console.log('inside mapStateToProps function of App.js, this is passed in props',props);
  const { center, content, lastFetched, fence, insideFence, previousPolygon, watchID } = props.MapReducer.centerDetail;
  const { polygons } = props.MapReducer.polygonDetail;
  return { center, content, lastFetched, fence, insideFence, previousPolygon, watchID, polygons };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCenterProp : center => {
      dispatch(setCenter(center));
    },
    setWatchIdProp: watchId => {
      dispatch(setWatchId(watchId))
    },
    setInsideFenceProp: insideFence => {
      dispatch(setInsideFence(insideFence));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
