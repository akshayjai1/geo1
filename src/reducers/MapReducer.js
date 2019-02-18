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
    centerDetail : {
        center: {lat: 43.642558, lng: 74},
        content: 'Getting Position...',
        lastFetched: null,
        fence: null,
        insideFence: false,
        previousPolygon: null,
        watchID: null,
        
    },
    polygonDetail : {
        polygons: customPolygons,
    }
}
export default (state = initialState, action) => {
    switch(action.type){
        case types.GET_CENTER:
            console.log('executing getcenter action');
            return action.payload;
        case types.SET_CENTER:
            console.log('reducing setCenter',action.payload,state);
            var x =  {
                ...state,
                centerDetail: {
                    ...state.centerDetail,
                    ...action.payload.centerDetail
                }
            };
            console.log('this is reduced state in setCenter',x);
            return x;
        case types.SET_WATCH_ID:
            console.log('setting watch Id to ',action.payload.watchID);
            var x =  {
                ...state,
                centerDetail: {
                    ...state.centerDetail,
                    ...action.payload
                }
            };
            console.log('this is reduced state in setWatchId',x);
            return x;
        case types.SET_INSIDE_FENCE: 
            console.log('reducing inside fence with state and action.payload',state,action.payload);
            var x =  {
                ...state,
                centerDetail: {
                    ...state.centerDetail,
                    ...action.payload
                }
            };
            console.log('this is reduced state in setInsideFence',x);
            return x;
        case types.SET_FENCE: 
        console.log('reducing fence with state and action.payload',state,action.payload);
        var x =  {
            ...state,
            centerDetail: {
                ...state.centerDetail,
                ...action.payload
            }
        };
        console.log('this is reduced state in setFence',x);
        return x;
        case types.SET_POLYGON: 
        console.log('reducing setPolygon with state and action.payload',state,action.payload);
        var x =  {
            ...state,
            centerDetail: {
                ...state.centerDetail,
                ...action.payload
            }
        };
        console.log('this is reduced state in setFence',x);
        return x;
        default:
            console.log('executing default action',state);
            return state;
    }
};
//todo use const/let at appropriate place