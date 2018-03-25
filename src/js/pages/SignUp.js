/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import "../../css/login.css";
import FormInput from "../components/FormInput";
import { apiPost } from "../utils/Api";

export default class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            name: "",
            password: "",
            retypePassword: "",
            errors: {
                email: false,
                name: false,
                password: false,
                retypePassword: false,
                differentPasswords: false,
            },
            responseError: false,
        };

        this.socialLoginResponse = this.socialLoginResponse.bind( this );
        this.callSocialLoginApi = this.callSocialLoginApi.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleInputFocus = this.handleInputFocus.bind( this );
        this.handleRegister = this.handleRegister.bind( this );

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
                this.setState( { responseError: true } );
            } );
    }

    handleInputChange( evt ) {
        let { name } = evt.target;
        const { value } = evt.target;
        if ( name === "retyped Password" ) {
            name = "retypePassword";
        }
        this.setState( {
            [ name ]: value,
        } );
    }

    handleInputFocus() {
        this.setState( {
            errors: {
                email: false,
                password: false,
                retypePassword: false,
                name: false,
            },
        } );
    }

    handleRegister() { // eslint-disable-line
        const {
            email, password, retypePassword, name,
        } = this.state;
        const invalidEmail = email === "";
        const invalidPassword = password === "";
        const invalidName = name === "";
        const invalidRetypePassword = retypePassword === "";
        const differentPasswordsError = retypePassword !== password;

        if ( invalidPassword || invalidEmail || invalidName ||
            invalidRetypePassword || differentPasswordsError ) {
            this.setState( {
                errors: {
                    email: invalidEmail,
                    password: invalidPassword,
                    retypePassword: invalidRetypePassword,
                    name: invalidName,
                    differentPasswords: differentPasswordsError,
                },
                responseError: differentPasswordsError,
            } );
            setTimeout( () => this.setState( { responseError: false } ), 5000 );
            return;
        }

        apiPost(
            "/api/users/registration",
            {
                email, password, displayName: name, provider: "local",
            },
        )
            .then( () => {
                this.setState( { isRegisterSuccessful: true } );
            } )
            .catch( ( error ) => {
                console.log( error );
                this.setState( { responseError: true } );
            } );
    }

    socialLoginResponse( response, providerType ) {
        const { accessToken } = response;
        this.accessToken = accessToken;
        console.log( response );
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
            errors, email, password, retypePassword, name, responseError,
            isRegisterSuccessful,
        } = this.state;
        const {
            email: invalidEmail, password: invalidPassword, retypePassword: invalidRetypePassword,
            name: invalidName, differentPasswords,
        } = errors;

        const errorType = differentPasswords ? "Passwords do not match." :
            "Something went wrong. Please try again.";

        return (
            <div className="login-page">
                <div className="register-container">
                    {
                        isRegisterSuccessful ?
                            <div className="redirect-container">

                                <h1 className="redirect-message">
                            Great! Now you can login into your new account
                                </h1>
                                <button
                                    className="signup-button"
                                    onClick={ () => this.props.history.replace( "/login" ) }
                                >go to login page
                                </button>
                            </div>
                            :
                            <h1 className="register-title">Let&apos;s be friends</h1>
                    }

                    <div className="register-main-container">
                        <div className="login-form-container">
                            {
                                responseError ?
                                    <h5 className="login-error">
                                        {errorType}
                                    </h5> :
                                    <h4 className="login-message">
                    Please enter your details to create an account.
                                    </h4>
                            }

                            <FormInput
                                inputName="name"
                                labelText="What's your name?"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ name }
                                isMissing={ invalidName }
                            />

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

                            <FormInput
                                inputName="retyped Password"
                                labelText="Your password again"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden
                                value={ retypePassword }
                                isMissing={ invalidRetypePassword }
                            />

                            <button className="register-button" onClick={ this.handleRegister }>
                            continue
                            </button>
                        </div>

                        <div className="social-login-container">
                            <h3 className="alternative-login-title">or register using one of your
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

                </div>
            </div>
        );
    }
}

SignUp.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
    // isRegisterSuccessful: PropTypes.bool.isRequired,
};
