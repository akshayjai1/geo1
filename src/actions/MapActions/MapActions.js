import { types } from './../types';
export const setCenter = (centerDetail) => {
  console.log('inside setCenter action with center ',centerDetail);
  return (dispatch) => {
    dispatch({
      type: types.SET_CENTER,
      payload: {
        centerDetail,
      }
    });
  }
}

export const setWatchId = (watchId) => {
  console.log('inside setWatchId with id =  ',watchId);
  return {
      type: types.SET_WATCH_ID,
      payload: {
        watchId,
      }
  }
}

export const setInsideFence = (insideFence) => {
  console.log('inside setInsideFence with boolean =  ',insideFence);
  return {
      type: types.SET_INSIDE_FENCE,
      payload: {
        insideFence,
      }
  }
}