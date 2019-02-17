import { types } from './../actions/types';
const initialState = {
  center: {lat: 43.642558, lng: 74}
}
export default (state = initialState, action) => {
    switch(action.type){
        case types.GET_CENTER:
            console.log('executing getcenter action');
            return action.payload;
        default:
            console.log('executing default action',state);
            return state;
    }
};