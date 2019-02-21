import { compose } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import GoogleMapWithSearch from './GoogleMapWithSearch';
import LifeCycleForSearch from './lifeCycleForSearch';
import GoogleMapLoadingProps from './GoogleMapLoadingProps';

const MapWithASearchBox = compose(
  GoogleMapLoadingProps,
  LifeCycleForSearch,
  withScriptjs,
  withGoogleMap
)(GoogleMapWithSearch);
 

export default MapWithASearchBox;
