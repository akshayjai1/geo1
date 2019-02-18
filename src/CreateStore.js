import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import RootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export const middlewares = [ReduxThunk];

export const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export const store = createStoreWithMiddleware(RootReducer);
console.log('store created successfully, this is current state in store', store.getState());