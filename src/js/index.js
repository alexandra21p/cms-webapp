import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

import configureStore from "./redux/store/configureStore";
import App from "./App";
import "../css/main.scss";
import "../css/custom.scss";
import "../css/responsive.scss";

const appContainer = document.querySelector( ".app" );

const initialState = {
    user: {
        isAuthenticated: false,
        userData: {},
    },
    messages: {
        error: {
            status: false,
            message: "",
        },
        showSuccessMessage: false,
        templateCreationModal: false,
    },
    templates: {
        allTemplates: [],
        currentTemplate: {
            name: "",
            rootComponent: {},
        },
        fonts: [],
    },
    canvas: {
        selectedItem: null,
    },
    customComponents: [],
};

const store = configureStore( initialState );

ReactDOM.render(
    (
        <Provider store={ store }>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    ),
    appContainer,
);
