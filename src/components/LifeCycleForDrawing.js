import { lifecycle } from 'recompose';
const google = window.google = window.google ? window.google : {}

const _ = require("lodash");
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
 const checkGeofence = () => {
    console.log('inside fn checkGeoFence');
    if (!this.props.fence) {
      return;
    }
    const insideFence = google.maps.geometry.poly
      .containsLocation(this.getCurrentPosition(), this.props.fence);
    this.props.setInsideFenceProp(insideFence);
  }
const watchLocation =  () => {
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
  const doneDrawing = (polygon) => {
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
const LifeCycleForDrawing = lifecycle({
    componentdidMount(props) {
      console.log('inside component will mount of mapwithsearchbox, this are the arguments and this', arguments,this);
      const refs = {}
      console.log('this is the value of this in componentWillMount of MapWithSearchbox',this);
      this.setState({
        markers: this.props.markers,
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: (setBoundsSearchProp) => {
          console.log("inside onBoundsChanged function, this is the value of this",this);
          setBoundsSearchProp(refs.map.getBounds());
          // this.setState({
          //   center: refs.map.getCenter(),
          // });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: (setCenterSearchProp,setMarkersSearchProp) => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          console.log('after place changed, these is bounds and places', bounds, places)
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          console.log('this is new center and marker ', nextCenter, nextMarkers);
          setCenterSearchProp({
            center: nextCenter
          })
          setMarkersSearchProp({
            markers: nextMarkers
          })
          // refs.map.fitBounds(bounds);
        },
      })
    },
  })

  export default LifeCycleForDrawing;