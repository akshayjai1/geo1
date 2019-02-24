import types from './../types';
export const setCenter = (centerDetail) => {
  console.log('inside setCenter action with center ',centerDetail);
  return (dispatch) => {
    dispatch({
      type: types.SET_CENTER,
      payload: {
        ...centerDetail,
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

export const setFence = (fence) => {
  console.log('inside setFence with fence =  ',fence);
  return {
      type: types.SET_FENCE,
      payload: {
        fence,
      }
  }
}


export const setPolygon = (polygon) => {
  console.log('inside setPolygon with polygon =  ',polygon);
  return {
      type: types.SET_POLYGON,
      payload: {
        previousPolygon:polygon,
      }
  }
}

export const setBounds = (bounds) => {
  console.log('inside setBounds with bounds =  ',bounds);
  return {
      type: types.SET_BOUNDS,
      payload: {
        bounds,
      }
  }
}

export const setMarkers = (markers) => {
  console.log('inside setMarkers with markers =  ', markers);
  return {
      type: types.SET_MARKERS,
      payload: {
        markers,
      }
  }
}