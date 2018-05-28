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
import { apiPost, apiGet, apiPut } from "./utils/Api";
import * as userActions from "./redux/actions/userActions";
import { errors } from "./utils/errors";
import { getError, encryptToken, decryptAppTokens } from "./utils/helperMethods";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
        };

        this.handleSocialLogin = this.handleSocialLogin.bind( this );
        this.handleLocalRegister = this.handleLocalRegister.bind( this );
        this.handleLogout = this.handleLogout.bind( this );
        this.getUserProfile = this.getUserProfile.bind( this );
        this.handlePasswordChange = this.handlePasswordChange.bind( this );
        this.handleProfileUpdate = this.handleProfileUpdate.bind( this );
    }

    componentWillMount() {
        const authToken = localStorage.getItem( "auth" );
        const user = JSON.parse( localStorage.getItem( "userDetails" ) );

        if ( !authToken && !user ) {
            this.props.loadLoggedUserFailure();
            return;
        }

        const userData = decryptAppTokens();
        this.props.getUserProfile( userData );
    }

    getUserProfile( id, provider, authToken, socialAuthToken ) {
        const headers = socialAuthToken ? {
            "x-access-token": authToken,
            "access-token": socialAuthToken,
        } : { "x-access-token": authToken };

        apiGet(
            `/api/users/getProfile/${ provider }/${ id }`,
            headers,
        )
            .then( ( { payload } ) => {
                this.setState( { user: payload } );
            } )
            .catch( ( error ) => {
                console.log( error );
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
                    showSuccessMessage: true,
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

    handleLogout( email, provider, appToken, socialAuthToken ) {
        let headers = { "x-access-token": appToken };

        if ( socialAuthToken ) {
            headers = Object.assign( {}, headers, { access_token: socialAuthToken } );
        }

        apiPost(
            "/api/users/logout",
            { email, provider },
            headers,
        )
            .then( () => {
                this.setState( { isAuthenticated: false } );
                localStorage.removeItem( "auth" );
                localStorage.removeItem( "userDetails" );
                this.props.history.replace( "/login" );
            } )
            .catch( ( error ) => {
                console.log( error );
            } );
    }

    handleSocialLogin( provider, accessToken ) {
        apiPost(
            `/api/users/auth/${ provider }`,
            {
                access_token: accessToken,
                provider,
            },

        )
            .then( payload => {
                const { token, user: { providers, socialAccessToken } } = payload;

                const { email, profileId: id } = providers.find( prov => prov.type === provider );
                const reversedId = id.split( "" ).reverse().join( "" );
                const encryptedToken = encryptToken( token, id, reversedId );

                localStorage.setItem( "auth", encryptedToken );
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify( {
                        id, email, provider, socialAuthToken: socialAccessToken,
                    } ),
                );

                this.setState(
                    {
                        isAuthenticated: true,
                        error: {
                            status: false,
                            message: "",
                        },
                        showSuccessMessage: false,
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
                    isAuthenticated: false,
                } );
            } );
    }

    handlePasswordChange( currentPassword, newPassword, retypedPassword, userDetails ) {
        const differentPasswords = newPassword !== retypedPassword;
        const message = getError( "different_passwords", errors );
        const {
            email, provider, decryptedToken, decryptedSocialToken,
        } = userDetails;

        if ( differentPasswords ) {
            this.setState( {
                error: {
                    status: true,
                    message,
                },
            } );
            return;
        }

        const headers = decryptedSocialToken ? {
            "x-access-token": decryptedToken,
            "access-token": decryptedSocialToken,
        } : { "x-access-token": decryptedToken };

        apiPut(
            "/api/users/editPassword",
            {
                email, provider, password: currentPassword, newPassword,
            },
            headers,
        )
            .then( ( payload ) => {
                this.setState( { user: payload, showSuccessMessage: true } );
            } )
            .catch( ( error ) => {
                const msg = error.message === "401" ?
                    "Could not make changes. Check your password."
                    : getError( error.message, errors );
                this.setState( {
                    error: {
                        status: true,
                        message: msg,
                    },
                } );
            } );
    }

    handleProfileUpdate( email, name, avatar, userDetails ) {
        const {
            id, provider, decryptedToken, decryptedSocialToken,
        } = userDetails;

        const headers = decryptedSocialToken ? {
            "x-access-token": decryptedToken,
            "access-token": decryptedSocialToken,
        } : { "x-access-token": decryptedToken };

        apiPut(
            "/api/users/edit",
            {
                profileId: id, provider, email, displayName: name, avatar,
            },
            headers,
        )
            .then( ( payload ) => {
                this.setState( {
                    user: payload,
                    showSuccessMessage: true,
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

    render() {
        const options = {
            isAuthenticated: this.props.isAuthenticated,
            error: this.props.error,
            handleSocialLogin: this.handleSocialLogin,
            handleLocalRegister: this.handleLocalRegister,
            handleLogout: this.handleLogout,
            getUserProfile: this.getUserProfile,
            handlePasswordChange: this.handlePasswordChange,
            handleProfileUpdate: this.handleProfileUpdate,
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
                <PrivateRoute path="/settings" component={ Settings } options={ options } />
                <PrivateRoute path="/designer" component={ Designer } options={ options } />
            </Switch>
        );
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
    getUserProfile: PropTypes.func.isRequired,
    loadLoggedUserFailure: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    error: PropTypes.object.isRequired,

};

const mapStateToProps = ( state ) => ( {
    isAuthenticated: state.user.isAuthenticated,
    error: state.messages.error,
} );

const mapDispatchToProps = dispatch => ( {
    getUserProfile: userData => dispatch( userActions.getUserProfile( userData ) ),
    loadLoggedUserFailure: () => dispatch( userActions.loadLoggedUserFailure() ),
} );

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
