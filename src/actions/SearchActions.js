import { types } from './types';
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