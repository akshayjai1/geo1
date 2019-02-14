/* global google */
import React, {Component} from 'react';
import Moment from 'react-moment';
import Map from './Map';
import './App.css';
import MapWithASearchBox from './MapWithSearchBox';

const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=${process.env.REACT_APP_MAPS_API_KEY}`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {
        // CN Tower default
        lat: 43.642558,
        lng: -79.387046,
      },
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
    this.setState({
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
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
        <Map
          googleMapURL={googleMapURL}
          loadingElement={
            <p>Loading maps...</p>
          }
          containerElement={
            <div className="map-container" />
          }
          mapElement={
            <div className="map" />
          }
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

export default App;
