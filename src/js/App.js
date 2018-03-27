import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, withRouter } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Designer from "./pages/Designer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import { apiPost, apiGet } from "./utils/Api";
import { errors } from "./utils/errors";
import { getError, encryptToken } from "./utils/helperMethods";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            isAuthenticated: false,
            error: {
                status: false,
                message: "",
            },
            user: {},
            showSuccessfulRegister: false,
        };

        this.handleLocalLogin = this.handleLocalLogin.bind( this );
        this.handleSocialLogin = this.handleSocialLogin.bind( this );
        this.handleLocalRegister = this.handleLocalRegister.bind( this );
        this.hideRedirectMessage = this.hideRedirectMessage.bind( this );
        this.getUserProfile = this.getUserProfile.bind( this );
    }

    componentWillMount() {
        const authToken = localStorage.getItem( "auth" );
        const user = JSON.parse( localStorage.getItem( "userDetails" ) );

        if ( !authToken && !user ) {
            this.setState( { isAuthenticated: false } );
            return;
        }
        const { provider } = user;
        if ( provider === "local" ) {
            this.setState( { isAuthenticated: true } );
            return;
        }

        // const loginStatus = checkProviderLoginStatus( provider );
        // if ( !loginStatus ) {
        //     localStorage.removeItem( "auth" );
        //     localStorage.removeItem( "userDetails" );
        //     this.setState( { isAuthenticated: false } );
        //     return;
        // }
        this.setState( { isAuthenticated: true } );
    }

    getUserProfile( authToken, userId ) {
        console.log( authToken, userId, this );
        apiGet(
            `/api/users/getProfile/${ userId }`,
            { "x-access-token": authToken },
        )
            .then( ( { payload } ) => {
                this.setState( { user: payload } );
            } )
            .catch( ( error ) => {
                console.log( error );
            } );
    }

    handleLocalLogin( email, password, provider ) {
        apiPost(
            "/api/users/login",
            { email, password, provider },
        )
            .then( payload => {
                const { token, user: { id } } = payload;
                const reversedId = id.split( "" ).reverse().join( "" );
                const encryptedToken = encryptToken( token, id, reversedId );

                localStorage.setItem( "auth", encryptedToken );
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify( { id, email, provider: "local" } ),
                );

                this.setState(
                    {
                        isAuthenticated: true,
                        error: {
                            status: false,
                            message: "",
                        },
                    },
                    () => this.props.history.replace( "/profile" ),
                );
            } )
            .catch( ( error ) => {
                const message = getError( error.message, errors );
                this.setState( {
                    error: {
                        status: true,
                        message,
                    },
                } );
            } );
    }

    handleLocalRegister( email, password, retypePassword, name, provider ) {
        const differentPasswords = password !== retypePassword;
        const message = getError( "different_passwords", errors );

        if ( differentPasswords ) {
            this.setState( {
                error: {
                    status: true,
                    message,
                },
            } );
            return;
        }

        apiPost(
            "/api/users/registration",
            {
                email, password, displayName: name, provider,
            },
        )
            .then( () => {
                this.setState( {
                    showSuccessfulRegister: true,
                    error: {
                        status: false,
                        message: "",
                    },
                } );
            } )
            .catch( ( error ) => {
                const msg = getError( error.message, errors );
                this.setState( {
                    error: {
                        status: true,
                        message: msg,
                    },
                } );
            } );
    }

    handleSocialLogin( provider, accessToken ) {
        apiPost(
            `/api/users/auth/${ provider }`,
            { access_token: accessToken },
        )
            .then( payload => {
                const { token, user: { providers, id } } = payload;
                const { email } = providers.find( prov => prov.type === provider );
                const reversedId = id.split( "" ).reverse().join( "" );
                const encryptedToken = encryptToken( token, id, reversedId );

                localStorage.setItem( "auth", encryptedToken );
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify( { id, email, provider } ),
                );

                this.setState(
                    {
                        isAuthenticated: true,
                        error: {
                            status: false,
                            message: "",
                        },
                    },
                    () => this.props.history.replace( "/profile" ),
                );
            } )
            .catch( ( error ) => {
                const message = getError( error.message, errors );
                this.setState( {
                    error: {
                        status: true,
                        message,
                    },
                } );
            } );
    }

    hideRedirectMessage() {
        this.setState( {
            showSuccessfulRegister: false,
        } );
    }

    render() {
        const {
            isAuthenticated, error, showSuccessfulRegister, user,
        } = this.state;

        const options = {
            isAuthenticated,
            error,
            showSuccessfulRegister,
            handleLocalLogin: this.handleLocalLogin,
            handleSocialLogin: this.handleSocialLogin,
            handleLocalRegister: this.handleLocalRegister,
            hideRedirectMessage: this.hideRedirectMessage,
            getUserProfile: this.getUserProfile,
            user,
        };

        return (
            <Switch>
                <Route exact path="/" component={ Home } />
                <Route
                    path="/login"
                    render={ props => ( (
                        <Login
                            { ...props }
                            options={ options }
                        /> ) ) }
                />
                <Route
                    path="/signup"
                    render={ props => ( (
                        <SignUp
                            { ...props }
                            options={ options }
                        /> ) ) }
                />
                <PrivateRoute path="/profile" component={ Profile } options={ options } />
                <PrivateRoute path="/designer" component={ Designer } options={ options } />
            </Switch>
        );
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
};

export default withRouter( App );
