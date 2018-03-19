import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ( { component: Component, options, options: { isAuthenticated }, ...rest } ) => ( // eslint-disable-line
    <Route
        { ...rest }
        render={ props => (
            isAuthenticated ? (
                <Component { ...props } options={ options } />
            ) : (
                <Redirect to={ {
                    pathname: "/login",
                } }
                />
            )
        ) }
    />
);

export default PrivateRoute;
