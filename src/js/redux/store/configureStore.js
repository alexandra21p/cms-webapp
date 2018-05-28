import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "../reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
|| compose; /* eslint no-underscore-dangle: "off" */

export default function configureStore( initialState ) {
    return createStore(
        rootReducer,
        initialState,
        composeEnhancers( applyMiddleware( thunk ) ),
    );
}
