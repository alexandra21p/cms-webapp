/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "../../css/login.scss";
import FormInput from "../components/FormInput";
import SocialLogin from "../components/SocialLogin";
import * as userActions from "../redux/actions/userActions";
import * as messageActions from "../redux/actions/messageActions";

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            validationErrors: {
                email: false,
                password: false,
            },
            clickedFacebookLogin: false,

        };

        this.socialLoginResponse = this.socialLoginResponse.bind( this );
        this.callSocialLoginApi = this.callSocialLoginApi.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleInputFocus = this.handleInputFocus.bind( this );
        this.handleFacebookClick = this.handleFacebookClick.bind( this );
        this.handleLogin = this.handleLogin.bind( this );
        this.goToSignupPage = this.goToSignupPage.bind( this );

        this.accessToken = "";
    }

    callSocialLoginApi( providerType ) {
        this.props.loginUserSocial( {
            provider: providerType,
            accessToken: this.accessToken,
        } )
            .then( () => {
                this.props.history.replace( "/profile" );
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
            validationErrors: {
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
                validationErrors: {
                    email: invalidEmail,
                    password: invalidPassword,
                },
            } );
            return;
        }

        this.props.loginUserLocal( {
            email, password, provider: "local",
        } )
            .then( () => {
                this.props.history.replace( "/profile" );
            } );
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

    goToSignupPage() {
        this.props.hideMessage();
        this.props.history.replace( "/signup" );
    }

    render() {
        const {
            validationErrors, email, password,
        } = this.state;
        const { email: invalidEmail, password: invalidPassword } = validationErrors;
        const { error } = this.props;

        return (
            <div className="login-page">
                <div className="login-container">
                    <h1 className="login-title">Welcome back</h1>

                    <div className="main-container">
                        <div className="login-form-container">
                            {
                                error.status ?
                                    <h5 className="notification-message error">
                                        {error.message}
                                    </h5> :
                                    <h4 className="login-message">
                    Please enter your details to login into your account.
                                    </h4>
                            }
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

                            <button className="login-button" onClick={ this.handleLogin }>
                            login
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
                    <div className="new-account-container">
                        <h3 className="new-account-message">
                    New around here? Go ahead and create an account.
                        </h3>
                        <button
                            className="signup-button"
                            onClick={ this.goToSignupPage }
                        >sign up
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUserLocal: PropTypes.func.isRequired,
    loginUserSocial: PropTypes.func.isRequired,
    error: PropTypes.shape( {
        status: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
    } ).isRequired,
    hideMessage: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};

const mapStateToProps = ( state ) => ( {
    error: state.messages.error,
} );
const mapDispatchToProps = ( dispatch ) => ( {
    loginUserLocal: loginData => dispatch( userActions.loginUserLocal( loginData ) ),
    hideMessage: () => dispatch( messageActions.hideMessage() ),
    loginUserSocial: loginData => dispatch( userActions.loginUserSocial( loginData ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Login );
