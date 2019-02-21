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
          this.reff.map = ref;
        },