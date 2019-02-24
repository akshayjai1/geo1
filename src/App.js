/* global google */
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import './App.css';
import MapWithASearchBox from './components/MapWithSearchBoxContainer';
import GeoMap from './components/GeoMap';
import GeoMapFn from './components/GeoMapFn';
import NewGoogleMapFn from './components/NewGoogleMapFn';
function App(props) {
    console.log('this is props of App',props);

    console.log('inside the render method of app, this is props', props);
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
              <NavLink to="/geoFence">GeoFence</NavLink>{"  "}
              <NavLink to="/geoFenceFn">geoFenceFn</NavLink>{"  "}
              <NavLink to="/geoSearch">Search</NavLink>
          <Switch>
            <Route path="/geoFence" component={GeoMap} />
            <Route path="/geoFenceFn" component={GeoMapFn} />
            <Route path="/geoSearch" component={MapWithASearchBox} />
            <Route path="" component={NewGoogleMapFn}/>
          </Switch>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
}

export default App;