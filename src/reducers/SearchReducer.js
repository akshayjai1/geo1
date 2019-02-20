import { types } from './../actions/types';

const initialState = {
    center: {lat: 20, lng: 80},
    content: 'Getting Position...',
    lastFetched: null,
    markers:[],
    bounds: null,
}

export default (state = initialState, action) => {
    var x;
    switch(action.type){
        case types.GET_CENTER:
            console.log('executing getcenter action');
            return action.payload;
        case types.SET_CENTER_SEARCH:
            console.log('reducing setCenter',action.payload,state);
            x =  {
                ...state,
                ...action.payload
            };
            console.log('this is reduced state in setCenter',x);
            return x;
        default:
            console.log('executing default action',state);
            return state;
    }
};
//todo use const/let at appropriate place