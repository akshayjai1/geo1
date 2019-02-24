const _ = require("lodash");
export const onPlacesChanged = ({searchRef,google,setMarkers,currentCenter,setCenter}) => {
  console.log('on places changed called');
  const places = searchRef.getPlaces();
  console.log('these are the places',places);
  const bounds = new google.maps.LatLngBounds();

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
  const nextCenter = _.get(nextMarkers, '0.position', currentCenter);
  console.log('setting new center and new marker');
  setCenter(nextCenter);
  setMarkers(nextMarkers);
  // refs.map.fitBounds(bounds);
}