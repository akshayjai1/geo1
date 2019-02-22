import { lifecycle } from 'recompose';
const google = window.google = window.google ? window.google : {}

const _ = require("lodash");

const LifeCycleForSearch = lifecycle({
    componentDidMount(props) {
      console.log('inside component will mount of mapwithsearchbox, this are the arguments and this', arguments,this);
      const refs = {}
      console.log('this is the value of this in componentWillMount of MapWithSearchbox',this);
      const { reff } = { props}
      this.setState({
          reff :this.props.reff || {},
        // onMapMounted: ref => {
        //   refs.map = ref;
        //   this.reff.map = ref;
        // },
        onSearchBoxMounted: ref => {
        //   refs.searchBox = ref;
        console.log("inside onSearchBoxMounted of LifeCycleForSearch",this,ref);
            this.setState((prevState)=>{
              console.log('setting searchbox on state.ref, this is previous state',prevState);
              const x =  {
                    reff: {
                        ...prevState.reff,
                        searchBox: ref
                    }
                }
              console.log(x);
              return x;
            });
          this.state.reff.searchBox = ref;
        },
        onBoundsChanged: (setBoundsSearchProp) => {
          console.log("inside onBoundsChanged function in LifeCycleForSearch, this is the value of this",this);
        //   setBoundsSearchProp(refs.map.getBounds());
        // console.log('trying to access map using this.props.reff.map',this.props.reff.map.getCenter());
        // console.log('trying to access map using this.props.reff.map',this.props.reff.map.getBounds());
         
        // lets comment it for now, we do not need bounds changed as of now
        // setBoundsSearchProp(this.props.reff.map.getBounds());
        
         // this.setState({
          //   center: refs.map.getCenter(),
          // });
        },
        onPlacesChanged: (setCenterSearchProp,setMarkersSearchProp) => {
          // const places = refs.searchBox.getPlaces();
          // const places = this
          const places=[];
          console.log('inside onPlacesChanged function, this is value of this',this);
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