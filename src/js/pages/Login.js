/* eslint jsx-a11y/label-has-for: "off" */
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

                            { error && <h3>Something went wrong while trying to login.</h3>}

                            <div className="input-container">
                                <label
                                    htmlFor="email"
                                    className="login-label"
                                >Email Address
                                </label>

                                <input
                                    name="email"
                                    type="text"
                                    className="login-input"
                                    // onChange={ onInputChange }
                                    // onFocus={ onFocus }
                                    // value={ value }
                                />
                            </div>

                            <div className="input-container">
                                <label
                                    htmlFor="password"
                                    className="login-label"
                                >Password
                                </label>

                                <input
                                    name="email"
                                    type="password"
                                    className="login-input"
                                    // onChange={ onInputChange }
                                    // onFocus={ onFocus }
                                    // value={ value }
                                />
                            </div>

                            <button className="login-button">
                            login
                            </button>
                        </div>

                        <div className="social-login-container">
                            <h3 className="alternative-login-title">or login using one of your
                                <span className="highlighted-text"> social accounts
                                </span>
                            </h3>
                            <div className="social-icons-container">
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
                                    className="google-login-button"
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
                    <h3 className="new-account-message">
                    New around here? Go ahead and create an account.
                    </h3>
                    <button className="signup-button">sign up
                    </button>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
};
