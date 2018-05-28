import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../css/main.scss";
import "../css/responsive.scss";

const appContainer = document.querySelector( ".app" );

ReactDOM.render(
    (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    ),
    appContainer,
);
