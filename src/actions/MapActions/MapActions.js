import { types } from './../types';
export const setCenter = (center) => {
  console.log('inside setCenter action with center ',center);
  return (dispatch) => {
    dispatch({
      type: types.SET_CENTER,
      payload: {
        center,
      }
    });
  }
}

