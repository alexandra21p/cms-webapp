import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import configureStore from "./redux/store/configureStore";
import App from "./App";
import "../css/main.scss";
import "../css/responsive.scss";

const appContainer = document.querySelector( ".app" );
const initialState = {
    user: {
        isAuthenticated: false,
    },
    messages: {
        error: {
            status: false,
            message: "",
        },
    },
};

const store = configureStore( initialState );

ReactDOM.render(
    (
        <Provider store={ store }>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    ),
    appContainer,
);
