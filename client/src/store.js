
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// Errors at the moment no store, Using line below, create empty store
// const store = createStore(() => [], {}, applyMiddleware());

const initialState = {};

const middleware = [thunk];

// 1st Parameter = rootReducer, 2nd = InitialState, 3rd = middleware
const store = createStore(
  rootReducer, 
  initialState, 
  compose(
    applyMiddleware(...middleware), 
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    ),
  );

export default store;
+