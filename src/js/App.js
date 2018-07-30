import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Designer from "./pages/Designer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import Settings from "./pages/Settings";
import PrivateRoute from "./components/PrivateRoute";
import * as userActions from "./redux/actions/userActions";
import * as messageActions from "./redux/actions/messageActions";
import { decryptAppTokens } from "./utils/helperMethods";

/* eslint react/no-unused-state: "off" */
class App extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    componentWillMount() {
        const authToken = localStorage.getItem( "auth" );
        const user = JSON.parse( localStorage.getItem( "userDetails" ) );

        if ( !authToken && !user ) {
            this.props.showUserActionError();
            return;
        }

        const userData = decryptAppTokens();
        this.props.getUserProfile( userData );
    }

    render() {
        const options = {
            isAuthenticated: this.props.isAuthenticated,
        };

        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    render={ props => ( (
                        <Home
                            { ...props }
                            options={ options }
                        /> ) ) }
                />

                <Route
                    exact
                    path="/login"
                    render={ props => ( (
                        <Login
                            { ...props }
                            options={ options }
                        /> ) ) }
                />
                <Route
                    exact
                    path="/signup"
                    render={ props => ( (
                        <SignUp
                            { ...props }
                            options={ options }
                        /> ) ) }
                />
                <PrivateRoute path="/profile" component={ Profile } options={ options } />
                <PrivateRoute path="/settings" component={ Settings } options={ options } />
                <PrivateRoute path="/designer" component={ Designer } options={ options } />
            </Switch>
        );
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
    getUserProfile: PropTypes.func.isRequired,
    showUserActionError: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    error: PropTypes.object.isRequired, // eslint-disable-line

};

const mapStateToProps = ( state ) => ( {
    isAuthenticated: state.user.isAuthenticated,
    error: state.messages.error,
} );

const mapDispatchToProps = dispatch => ( {
    getUserProfile: userData => dispatch( userActions.getUserProfile( userData ) ),
    showUserActionError: () => dispatch( messageActions.showUserActionError() ),
} );

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
