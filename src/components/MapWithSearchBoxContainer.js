import { compose } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import GoogleMapWithSearch from './GoogleMapWithSearch';
import LifeCycleForSearch from './lifeCycleForSearch';
import GoogleMapLoadingProps from '../constants/GoogleMapLoadingProps';
import LifeCycleForGoogleMap from './LifeCycleForGoogleMap';

const MapWithASearchBox = compose(
  GoogleMapLoadingProps,
  LifeCycleForGoogleMap,
  LifeCycleForSearch,
  withScriptjs,
  withGoogleMap
)(GoogleMapWithSearch);
 

export default MapWithASearchBox;
