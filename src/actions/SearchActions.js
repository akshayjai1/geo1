import types from './types';
export const setCenterSearch = (centerDetail) => {
  console.log('inside setCenter action with center ',centerDetail);
  return (dispatch) => {
    dispatch({
      type: types.SET_CENTER_SEARCH,
      payload: {
        ...centerDetail,
      }
    });
  }
}
export const setMarkersSearch = (markers) => {
  console.log('inside setMarkers with markers =  ', markers);
  return {
      type: types.SET_MARKERS_SEARCH,
      payload: {
        markers,
      }
  }
}
export const setBoundsSearch = (bounds) => {
  console.log('inside setMarkers with markers =  ', bounds);
  return {
      type: types.SET_BOUNDS_SEARCH,
      payload: {
        bounds,
      }
  }
}