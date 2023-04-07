import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// import { studentInfo } from "./reducers/student";
import { user } from "./reducers/user";

const store = createStore(
    combineReducers({ user }),
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
