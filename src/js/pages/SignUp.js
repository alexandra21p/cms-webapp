/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";

import "../../css/login.css";

import FormInput from "../components/FormInput";
import SocialLogin from "../components/SocialLogin";

export default class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            name: "",
            password: "",
            retypePassword: "",
            validationErrors: {
                email: false,
                name: false,
                password: false,
                retypePassword: false,
            },
            clickedFacebookLogin: false,
        };

        this.socialLoginResponse = this.socialLoginResponse.bind( this );
        this.callSocialLoginApi = this.callSocialLoginApi.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleInputFocus = this.handleInputFocus.bind( this );
        this.handleRegister = this.handleRegister.bind( this );
        this.handleFacebookClick = this.handleFacebookClick.bind( this );

        this.accessToken = "";
    }

    callSocialLoginApi( providerType ) {
        const { handleSocialLogin } = this.props.options;

        handleSocialLogin( providerType, this.accessToken );
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
            validationErrors: {
                email: false,
                password: false,
                retypePassword: false,
                name: false,
            },
        } );
    }

    handleRegister() {
        const {
            email, password, retypePassword, name,
        } = this.state;
        const invalidEmail = email === "";
        const invalidPassword = password === "";
        const invalidName = name === "";
        const invalidRetypePassword = retypePassword === "";

        if ( invalidPassword || invalidEmail || invalidName ||
            invalidRetypePassword ) {
            this.setState( {
                validationErrors: {
                    email: invalidEmail,
                    password: invalidPassword,
                    retypePassword: invalidRetypePassword,
                    name: invalidName,
                },
            } );
            return;
        }

        const { handleLocalRegister } = this.props.options;
        handleLocalRegister( email, password, retypePassword, name, "local" );
    }

    socialLoginResponse( response, providerType ) {
        const { accessToken } = response;
        const { clickedFacebookLogin } = this.state;

        this.accessToken = accessToken;
        const facebookCheck = !!( providerType === "facebook" && !clickedFacebookLogin );

        if ( !accessToken || accessToken === "" || facebookCheck ) {
            return;
        }
        this.callSocialLoginApi( providerType );
    }

    handleFacebookClick() {
        this.setState( { clickedFacebookLogin: true } );
        if ( this.accessToken ) {
            this.callSocialLoginApi( "facebook" );
        }
    }

    render() {
        const {
            validationErrors, email, password, retypePassword, name,
        } = this.state;
        const {
            email: invalidEmail, password: invalidPassword, retypePassword: invalidRetypePassword,
            name: invalidName,
        } = validationErrors;
        const { showSuccessMessage, error, hideMessage } = this.props.options;

        return (
            <div className="login-page">
                <div className="register-container">
                    {
                        showSuccessMessage ?
                            <div className="redirect-container">

                                <h1 className="redirect-message">
                            Great! Now you can login into your new account.
                                </h1>
                                <button
                                    className="signup-button"
                                    onClick={ () => {
                                        hideMessage();
                                        this.props.history.replace( "/login" );
                                    } }
                                >go to login page
                                </button>
                            </div>
                            :
                            <h1 className="register-title">Let&apos;s be friends</h1>
                    }

                    <div className="register-main-container">
                        <div className="login-form-container">
                            {
                                error.status ?
                                    <h5 className="notification-message error">
                                        {error.message}
                                    </h5> :
                                    <h4 className="login-message">
                    Please enter your details to create an account.
                                    </h4>
                            }

                            <FormInput
                                inputName="name"
                                className="input-container"
                                labelText="What's your name?"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ name }
                                isMissing={ invalidName }
                            />

                            <FormInput
                                inputName="email"
                                className="input-container"
                                labelText="Email Address"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ email }
                                isMissing={ invalidEmail }
                            />

                            <FormInput
                                inputName="password"
                                className="input-container"
                                labelText="Password"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden
                                value={ password }
                                isMissing={ invalidPassword }
                            />

                            <FormInput
                                inputName="retyped Password"
                                className="input-container"
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

                        <SocialLogin
                            handleSocialLoginResponseFacebook={ ( response ) => {
                                this.socialLoginResponse( response, "facebook" );
                            } }
                            handleSocialLoginResponseGoogle={ ( response ) => {
                                this.socialLoginResponse( response, "google" );
                            } }
                            handleFacebookClick={ this.handleFacebookClick }
                        />

                    </div>

                </div>
            </div>
        );
    }
}

SignUp.propTypes = {
    options: PropTypes.shape( {
        error: PropTypes.shape( {
            status: PropTypes.bool.isRequired,
            message: PropTypes.string.isRequired,
        } ).isRequired,
        showSuccessMessage: PropTypes.bool.isRequired,
        handleLocalRegister: PropTypes.func.isRequired,
        handleSocialLogin: PropTypes.func.isRequired,
        hideMessage: PropTypes.func.isRequired,
    } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
