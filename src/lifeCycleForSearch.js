import { lifecycle } from 'recompose';
const google = window.google = window.google ? window.google : {}

const _ = require("lodash");

const LifeCycleForSearch = lifecycle({
    componentDidMount(props) {
      console.log('inside component will mount of mapwithsearchbox, this are the arguments and this', arguments,this);
      const refs = {}
      console.log('this is the value of this in componentWillMount of MapWithSearchbox',this);
      this.setState({
          reff:{},
        onMapMounted: ref => {
          refs.map = ref;
          this.reff.map = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
          this.reff.searchBox = ref;
        },
        onBoundsChanged: (setBoundsSearchProp) => {
          console.log("inside onBoundsChanged function, this is the value of this",this);
          setBoundsSearchProp(refs.map.getBounds());
          // this.setState({
          //   center: refs.map.getCenter(),
          // });
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

  export default LifeCycleForSearch;