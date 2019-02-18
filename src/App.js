/* global google */
import React, {Component} from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Map from './Map';
import './App.css';
import MapWithASearchBox from './MapWithSearchBox';
import { withProps } from 'recompose';
import { MapConfig, PolygonOptions } from './constants/MapConstants';
import { setCenter, setWatchId, setInsideFence, setPolygon, setFence } from './actions/MapActions/MapActions';
import GeoMap from './components/GeoMap';
const MapWithProps = withProps(MapConfig)(Map);
class App extends Component {
  constructor(props) {
    super(props);
    console.log('this is props of App',props);
  }


  render() {
    console.log('inside the render method of app, this is props', this.props);
    return (
      <div className="App">
        <GeoMap />
      </div>
    );
  }
}

export default App;
