import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import traces from "./reducers/traces.js";

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [thunk, promiseMiddleware(), routerMiddleware(history)];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const rootReducer = combineReducers({
  routing: routerReducer,
  traces
});

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
