import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import "../css/main.css";

const appContainer = document.querySelector( ".app" );

ReactDOM.render(
    (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    ),
    appContainer,
);
