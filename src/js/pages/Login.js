import React from "react";
import PropTypes from "prop-types";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import "../../css/login.css";
import { apiPost } from "../utils/Api";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };

        this.socialLoginResponse = this.socialLoginResponse.bind( this );
        this.callSocialLoginApi = this.callSocialLoginApi.bind( this );
        this.accessToken = "";
    }

    callSocialLoginApi( providerType ) {
        apiPost(
            `/api/users/auth/${ providerType }`,
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

    socialLoginResponse( response, providerType ) {
        const { accessToken } = response;
        this.accessToken = accessToken;
        if ( !accessToken || accessToken === "" ) {
            this.setState( { error: true } );
            return;
        }
        if ( providerType === "google" ) {
            this.callSocialLoginApi( providerType );
        }
    }

    render() {
        const { error } = this.state;

        return (
            <div className="login-page">
                <div className="login-container">
                    <h1 className="login-title">Welcome back</h1>

                    <div className="main-container">
                        <div className="login-form-container">
                            <h4 className="login-message">
                    Please enter your details to login into your account.
                            </h4>
                        </div>

                        { error && <h3>Something went wrong while trying to login.</h3>}
                        <div className="social-icons-container">
                            <h3>or login using one of your social accounts</h3>
                            <FacebookLogin
                                appId="899445726913963"
                                autoLoad
                                fields="name,email,picture"
                                cssClass="social-login-button"
                                textButton=""
                                callback={ ( response ) => {
                                    this.socialLoginResponse( response, "facebook" );
                                } }
                                onClick={ this.callFacebookLoginApi }
                                onFailure={ ( response ) => {
                                    this.socialLoginResponse( response, "facebook" );
                                } }
                            />

                            <GoogleLogin
                                clientId="194832330236-ukd3dkogrp3itq90tc3mcnb0h04ku3tb.apps.googleusercontent.com"
                                buttonText=""
                                className="social-login-button"
                                onSuccess={ ( response ) => {
                                    this.socialLoginResponse( response, "google" );
                                } }
                                onFailure={ ( response ) => {
                                    this.socialLoginResponse( response, "google" );
                                } }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
};
