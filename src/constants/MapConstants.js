import React from 'react';
export const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=${process.env.REACT_APP_MAPS_API_KEY}`;

export const loadingElement = <p>Loading maps...</p>;
export const containerElement = <div className="map-container" />;
export const mapElement = <div className="map" />;
export const myLatLng = {lat: 20.397, lng: 73};
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
  strokeColor: '#904000',
  strokeWeight: 3,
  fillOpacity:0.05,
}

export const contentStringForInfoWindow = '<div id="content">'+
'<div id="siteNotice">'+
'</div>'+
'<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
'<div id="bodyContent">'+
'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
'sandstone rock formation in the southern part of the '+
'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
'south west of the nearest large town, Alice Springs; 450&#160;km '+
'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
'features of the Uluru - Kata Tjuta National Park. Uluru is '+
'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
'Aboriginal people of the area. It has many springs, waterholes, '+
'rock caves and ancient paintings. Uluru is listed as a World '+
'Heritage Site.</p>'+
'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
'(last visited June 22, 2009).</p>'+
'</div>'+
'</div>';