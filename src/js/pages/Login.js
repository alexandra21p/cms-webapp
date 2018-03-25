/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import "../../css/login.css";
import FormInput from "../components/FormInput";
import { apiPost } from "../utils/Api";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {
                email: false,
                password: false,
            },
            responseError: false,

        };

        this.socialLoginResponse = this.socialLoginResponse.bind( this );
        this.callSocialLoginApi = this.callSocialLoginApi.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleInputFocus = this.handleInputFocus.bind( this );
        this.handleLogin = this.handleLogin.bind( this );

        this.accessToken = "";
    }

    callSocialLoginApi( providerType ) {
        apiPost(
            `/api/users/auth/${ providerType }`,
            { access_token: this.accessToken },
        )
            .then( payload => {
                const { token, user: { providers } } = payload;
                const { email } = providers.find( provider => provider.type === providerType );
                localStorage.setItem( "auth", token );
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify( { email, provider: providerType } ),
                );
                this.props.history.replace( "/dashboard" );
            } )
            .catch( ( error ) => {
                console.log( error );
                this.setState( { responseError: true } );
            } );
    }

    handleInputChange( evt ) {
        const { name, value } = evt.target;
        this.setState( {
            [ name ]: value,
        } );
    }

    handleInputFocus() {
        this.setState( {
            errors: {
                email: false,
                password: false,
            },
        } );
    }

    handleLogin() {
        const { email, password } = this.state;
        const invalidEmail = email === "";
        const invalidPassword = password === "";
        if ( invalidPassword || invalidEmail ) {
            this.setState( {
                errors: {
                    email: invalidEmail,
                    password: invalidPassword,
                },
            } );
        }

        apiPost(
            "/api/users/login",
            { email, password, provider: "local" },
        )
            .then( payload => {
                const { token } = payload;
                localStorage.setItem( "auth", token );
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify( { email, provider: "local" } ),
                );
                this.props.history.replace( "/dashboard" );
            } )
            .catch( ( error ) => {
                console.log( error );
                this.setState( { responseError: true } );
            } );
    }

    socialLoginResponse( response, providerType ) {
        const { accessToken } = response;
        this.accessToken = accessToken;

        if ( !accessToken || accessToken === "" ) {
            this.setState( { responseError: true } );
            return;
        }
        if ( providerType === "google" ) {
            this.callSocialLoginApi( providerType );
        }
    }

    render() {
        const {
            errors, email, password, responseError,
        } = this.state;
        const { email: invalidEmail, password: invalidPassword } = errors;

        return (
            <div className="login-page">
                <div className="login-container">
                    <h1 className="login-title">Welcome back</h1>

                    <div className="main-container">
                        <div className="login-form-container">
                            {
                                responseError ?
                                    <h5 className="login-error">
                            Invalid username or password.
                                    </h5> :
                                    <h4 className="login-message">
                    Please enter your details to login into your account.
                                    </h4>
                            }
                            <FormInput
                                inputName="email"
                                labelText="Email Address"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ email }
                                isMissing={ invalidEmail }
                            />

                            <FormInput
                                inputName="password"
                                labelText="Password"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden
                                value={ password }
                                isMissing={ invalidPassword }
                            />

                            <button className="login-button" onClick={ this.handleLogin }>
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
                                    onClick={ () => this.callSocialLoginApi( "facebook" ) }
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
                    <div className="new-account-container">
                        <h3 className="new-account-message">
                    New around here? Go ahead and create an account.
                        </h3>
                        <button
                            className="signup-button"
                            onClick={ () => this.props.history.replace( "/signup" ) }
                        >sign up
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

Login.propTypes = {
    // responseError: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
