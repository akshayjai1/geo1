import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import RootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const devToolsOption = {trace: true, name: "Inchcape Shipping"}
const enhancedDevTools = composeWithDevTools(devToolsOption);

export const middlewares = [ReduxThunk];
const enhancer = enhancedDevTools(applyMiddleware(...middlewares));

export const store = createStore(RootReducer,{},enhancer);
console.log('store created successfully, this is current state in store', store.getState());



// export const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
// export const store = createStoreWithMiddleware(RootReducer);