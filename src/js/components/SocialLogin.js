import React from "react";
import PropTypes from "prop-types";

import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const SocialLogin = ( {
    handleSocialLoginResponseFacebook,
    handleSocialLoginResponseGoogle,
    handleFacebookClick,
} ) => (
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
                callback={ handleSocialLoginResponseFacebook }
                onClick={ handleFacebookClick }
                onFailure={ handleSocialLoginResponseFacebook }
            />

            <GoogleLogin
                clientId="194832330236-ukd3dkogrp3itq90tc3mcnb0h04ku3tb.apps.googleusercontent.com"
                buttonText=""
                className="google-login-button"
                onSuccess={ handleSocialLoginResponseGoogle }
                onFailure={ handleSocialLoginResponseGoogle }
            />
        </div>
    </div>
);

export default SocialLogin;

SocialLogin.propTypes = {
    handleSocialLoginResponseGoogle: PropTypes.func.isRequired,
    handleSocialLoginResponseFacebook: PropTypes.func.isRequired,
    handleFacebookClick: PropTypes.func.isRequired,
};
