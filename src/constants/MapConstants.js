import React from 'react';
export const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=${process.env.REACT_APP_MAPS_API_KEY}`;

export const loadingElement = <p>Loading maps...</p>;
export const containerElement = <div className="map-container" />;
export const mapElement = <div className="map" />;

export const MapConfig = {
  googleMapURL,
  loadingElement,
  containerElement,
  mapElement
};
export const PolygonOptions = {
  editable: true,
  draggable: true,
  opacity: 0,
  strokeOpacity: 0.5,
  strokeColor: '#00ffa0',
  strokeWeight: 3,
  fillOpacity:0,
}