import React from "react";
import PropTypes from "prop-types";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import { apiPost } from "../utils/Api";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };

        this.facebookLoginResponse = this.facebookLoginResponse.bind( this );
        this.googleLoginResponse = this.googleLoginResponse.bind( this );
        this.callFacebookLoginApi = this.callFacebookLoginApi.bind( this );
        this.accessToken = "";
    }

    callFacebookLoginApi() {
        apiPost(
            "/api/users/auth/facebook",
            { access_token: this.accessToken },
        )
            .then( payload => {
                const { token } = payload;
                localStorage.setItem( "auth", token );
                this.props.history.replace( "/dashboard" );
            } )
            .catch( ( error ) => {
                console.log( error );
                this.setState( { error: true } );
            } );
    }

    facebookLoginResponse( response ) {
        const { accessToken } = response;
        this.accessToken = accessToken;
    }

    googleLoginResponse( response ) {
        console.log( this );
        console.log( response );
    }

    render() {
        const { error } = this.state;

        return (
            <div>
                { error && <h3>Something went wrong when trying to login.</h3>}
                <FacebookLogin
                    appId="899445726913963"
                    autoLoad
                    fields="name,email,picture"
                    cssClass="fb-login-button"
                    textButton=""
                    callback={ this.facebookLoginResponse }
                    onClick={ this.callFacebookLoginApi }
                    onFailure={ this.facebookLoginResponse }
                />
                <GoogleLogin
                    clientId="194832330236-ukd3dkogrp3itq90tc3mcnb0h04ku3tb.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={ this.googleLoginResponse }
                    onFailure={ this.googleLoginResponse }
                />
            </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
};
