import React from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const socialLoginResponse = ( response ) => {
    console.log( response );
};

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        console.log( this );
        return (
            <div>
                <h2>hi, hello, lets be friends.</h2>
                <FacebookLogin
                    appId="899445726913963"
                    autoLoad
                    fields="name,email,picture"
                    callback={ socialLoginResponse }
                />
                <GoogleLogin
                    clientId="194832330236-ukd3dkogrp3itq90tc3mcnb0h04ku3tb.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={ socialLoginResponse }
                    onFailure={ socialLoginResponse }
                />
            </div>
        );
    }
}
