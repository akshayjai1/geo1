import { lifecycle } from 'recompose';
const google = window.google = window.google ? window.google : {}

const _ = require("lodash");

const LifeCycleForGoogleMap = lifecycle({
    componentDidMount(props) {
      console.log('inside componentDidMount of LifeCycleForGoogleMap this are the arguments and this', arguments,this);
      console.log('this is the value of this in componentWillMount of MapWithSearchbox',this);
      this.setState({
        reff:{},
        onMapMounted: ref => {
        //   refs.map = ref;
        //   this.reff.map = ref;
        console.log('inside onMapMounted of LifeCycleForGoogleMap',this,ref);
        console.log('we can get center from map',ref.getCenter());
            this.setState((prevState)=>{
                return {
                    reff: {
                        ...prevState.reff,
                        map: ref
                    }
                }
            });
        },

        onIdle : (setBoundsSearchProp) => {
            console.log("inside onBoundsChanged function, this is the value of this",this);
          //   setBoundsSearchProp(refs.map.getBounds());
          console.log('we can get center from map',this.state.reff.map.getCenter());
          setBoundsSearchProp(this.state.reff.map.getBounds());
            // this.setState({
            //   center: refs.map.getCenter(),
            // });
          },
    });
}
});

export default LifeCycleForGoogleMap;