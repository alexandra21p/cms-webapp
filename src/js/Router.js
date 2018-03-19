import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Designer from "./pages/Designer";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

const Router = () => (
    <Switch>
        <Route exact path="/" component={ Home } />
        <Route path="/login" component={ Login } />
        <PrivateRoute path="/profile" component={ Profile } />
        <PrivateRoute path="/designer" component={ Designer } />
    </Switch>
);

export default Router;
