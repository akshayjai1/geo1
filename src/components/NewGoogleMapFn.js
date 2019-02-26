import React from 'react';
import { googleMapURL, PolygonOptions, myLatLng, contentStringForInfoWindow } from '../constants/MapConstants';
import { printPolygonVertices, getPolygonVerticesFromPolygonPath } from './utils/MapUtils';
import types from '../actions/types';
const scriptjs = require('scriptjs');
const uuidv1 = require('uuid/v1');

const google = window.google = window.google ? window.google : {}

const NewGoogleMapFn = (props) => {
  var map;
  const newMapRef = React.useRef("");
  const searchInputRef = React.useRef("");
  
  const [markers, dispatchMarkersUpdate] = React.useReducer((markers, action)=> {
    switch(action.type) {
      case types.ADD_MARKER: 
        return [...markers,action.payload];
        break;
      default:
        return markers;
    }
  },[]);
  const [polygons, dispatchPathUpdate] = React.useReducer((polygons,action)=> {
    switch(action.type) {
      case types.ADD_POLYGON_VERTICES:
        return [...polygons, action.payload];
      case types.SET_POLYGON_SELECTED:
        const selectedId = action.payload.id;
        const updatedPolygonArray = polygons.map((polygon,index)=>{ 
          if(polygon.id == selectedId){
            if(polygon.selected){
              polygon.polygonReference.setOptions({fillOpacity: .05})
            } else {
              polygon.polygonReference.setOptions({fillOpacity: .2})
            }
            return { ...polygon, selected: !polygon.selected };
          } else {
            return polygon;
          }
        });
        console.log('this is updated polygon array',updatedPolygonArray);
        return updatedPolygonArray;
      case types.DELETE_SELECTED_POLYGONS:
        console.log('before deleting selected polygons',polygons);
        const newPolygons = polygons.filter(polygon=> {
          if(polygon.selected){
            polygon.polygonReference.setMap(null);
            return false; // to remove this polygon from array
          } else {
            return true
          }
        });
        console.log('after deleting selected polygons',newPolygons);
        return newPolygons;
      default: 
        return polygons;
    }
  },[]); 
  

  React.useEffect(()=>{
    scriptjs(googleMapURL, 'google',() => {
      map = new google.maps.Map(newMapRef.current, {
        center: myLatLng,
        zoom: 8,
        mapTypeId: 'roadmap'
      });
      // var marker = new google.maps.Marker(markPoint)
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
      })


      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polygon']
        },
        markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        polygonOptions: PolygonOptions
      });
      drawingManager.setMap(map);
      google.maps.event.addListener(drawingManager, "polygoncomplete", (polygon) => {
        console.log('this is created polygon', polygon);
        const path = polygon.getPath();
        console.log('polygon is complete, these are the vertices',path);
        printPolygonVertices(path);
        const Polygon = {
          id: uuidv1(),
          selected: false,
          polygonVertices: getPolygonVerticesFromPolygonPath(path),
          polygonReference: polygon,
        }
        dispatchPathUpdate({
          type: types.ADD_POLYGON_VERTICES,
          payload: Polygon
        });
        polygon.addListener("click",(polygonEvent)=>{
          console.log('polygon clicked this is event',polygonEvent);
          console.log('this is selection ',polygonEvent.va.view.getSelection());
          dispatchPathUpdate({
            type: types.SET_POLYGON_SELECTED,
            payload: {
              id: Polygon.id
            }
          })
        })
        console.log('these are vertices array ', polygons);
      })


      var infowindow = new google.maps.InfoWindow({
        content: contentStringForInfoWindow
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

      // Create the search box and link it to the UI element.
      var searchBox = new google.maps.places.SearchBox(searchInputRef.current);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInputRef.current);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // // Clear out the old markers.
        // markers.forEach(function(marker) {
        //   marker.setMap(null);
        // });
        // markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          dispatchMarkersUpdate({
            type: types.ADD_MARKER,
            payload: new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          })});
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    });//end of scriptjs callback
  },[])


  React.useEffect(()=>{
    console.log('vertices', polygons);

  },[polygons]);
  React.useEffect(()=>{
    console.log('markers', markers);
  },[markers]);

  const deleteSelectedPolygons = () => {
    dispatchPathUpdate({
      type: types.DELETE_SELECTED_POLYGONS
    });
  }

  return (
    <div>
      <input id="pac-input" className="controls" type="text" placeholder="Search Box" ref={searchInputRef}/>
      <div id="newMap" style={{height:"80vh"}} ref={newMapRef}>

      </div>
      <button onClick={deleteSelectedPolygons}>Clear Selected Polygon From Map</button>
    </div>
  )
}
export default NewGoogleMapFn;