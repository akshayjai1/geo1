import { types } from './../actions/types';
const customPolygon1 = [
    {lat:14,lng:80},
    {lat:13,lng:80},
    {lat:14,lng:81},
  ];
const customPolygon2 = [
    {lat:14,lng:80},
    {lat:13,lng:81},
    {lat:14,lng:81},
  ]
const customPolygons = [customPolygon1,customPolygon2];

const initialState = {
    center: {lat: 43.642558, lng: 74},
    content: 'Getting Position...',
    lastFetched: null,
    fence: null,
    insideFence: false,
    previousPolygon: null,
    watchID: null,
    polygonDetail : {
        polygons: customPolygons,
    }
}
export default (state = initialState, action) => {
    var x;
    switch(action.type){
        case types.GET_CENTER:
            console.log('executing getcenter action');
            return action.payload;
        case types.SET_CENTER:
            console.log('reducing setCenter',action.payload,state);
            x =  {
                ...state,
                ...action.payload
            };
            console.log('this is reduced state in setCenter',x);
            return x;
        case types.SET_WATCH_ID:
            console.log('setting watch Id to ',action.payload.watchID);
            x =  {
                ...state,
                ...action.payload
            };
            console.log('this is reduced state in setWatchId',x);
            return x;
        case types.SET_INSIDE_FENCE: 
            console.log('reducing inside fence with state and action.payload',state,action.payload);
            x =  {
                ...state,
                ...action.payload
            };
            console.log('this is reduced state in setInsideFence',x);
            return x;
        case types.SET_FENCE: 
            console.log('reducing fence with state and action.payload',state,action.payload);
            x =  {
                ...state,
                ...action.payload
            };
            console.log('this is reduced state in setFence',x);
            return x;
        case types.SET_POLYGON: 
            console.log('reducing setPolygon with state and action.payload',state,action.payload);
            x =  {
                ...state,
                ...action.payload
            };
            console.log('this is reduced state in setPolygon',x);
            return x;
        case types.SET_BOUNDS: 
            console.log('reducing setBounds with state and action.payload',state,action.payload);
            x =  {
                ...state,
                bounds:action.payload
            };
            console.log('this is reduced state in setBound',x);
            return x;
        default:
            console.log('executing default action',state);
            return state;
    }
};
//todo use const/let at appropriate place

export const WatchReducer = (state, action) => {
    
}