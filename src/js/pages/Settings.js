/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import "../../css/settings.css";
import "../../css/responsive.css";

import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import SettingsAvatar from "../components/SettingsAvatar";

import { defaultAvatar, decryptAppTokens } from "../utils/helperMethods";

export default class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            unsavedChanges: false,
            validationErrors: {
                name: false,
                email: false,
                newPassword: false,
                newRetypedPassword: false,
            },
            name: "",
            email: "",
            newPassword: "",
            newRetypedPassword: "",
            uploadedImage: "",
            showModal: false,
        };

        this.handleBackClick = this.handleBackClick.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleInputFocus = this.handleInputFocus.bind( this );
        this.onModalLeaveClick = this.onModalLeaveClick.bind( this );
        this.onModalStayClick = this.onModalStayClick.bind( this );
        this.removeImage = this.removeImage.bind( this );
        this.saveGeneralProfileChanges = this.saveGeneralProfileChanges.bind( this );
        this.savePasswordChanges = this.savePasswordChanges.bind( this );
    }

    onModalLeaveClick() {
        this.setState( { showModal: false } );
        this.props.history.replace( "/profile" );
    }

    onModalStayClick() {
        this.setState( { showModal: false } );
    }

    handleBackClick() {
        const { unsavedChanges } = this.state;
        if ( unsavedChanges ) {
            this.setState( { showModal: true } );
            return;
        }
        this.props.history.replace( "/profile" );
    }

    handleInputChange( evt ) {
        const { name, value } = evt.target;

        if ( name === "uploadedImage" ) {
            const file = evt.target.files[ 0 ];
            console.log( file );
            const reader = new FileReader();

            reader.onloadend = () => {
                console.log( reader );
                this.setState( {
                    [ name ]: reader.result,
                    unsavedChanges: true,
                } );
            };

            reader.readAsDataURL( file );
            return;
        }

        this.setState( {
            [ name ]: value,
            unsavedChanges: true,
        } );
    }

    handleInputFocus() {
        this.setState( {
            validationErrors: {
                name: false,
                email: false,
                newPassword: false,
                newRetypedPassword: false,
            },
        } );
    }

    removeImage() {
        this.setState( {
            uploadedImage: defaultAvatar,
        } );
    }

    saveGeneralProfileChanges() {
        const { email, name, uploadedImage } = this.state;
        const { handleProfileUpdate } = this.props.options;
        const invalidEmail = email === "";
        const invalidName = name === "";

        if ( invalidName || invalidEmail ) {
            this.setState( {
                validationErrors: {
                    name: invalidName,
                    email: invalidEmail,
                },
            } );
            return;
        }

        handleProfileUpdate( email, name, uploadedImage );
    }

    savePasswordChanges() {
        const { newPassword, newRetypedPassword } = this.state;
        const { handlePasswordChange } = this.props.options;
        const invalidPassword = newPassword === "";
        const invalidRetypedPassword = newRetypedPassword === "";

        if ( invalidPassword || invalidRetypedPassword ) {
            this.setState( {
                validationErrors: {
                    newPassword: invalidPassword,
                    newRetypedPassword: invalidRetypedPassword,
                },
            } );
            return;
        }

        const userDetails = decryptAppTokens();

        handlePasswordChange( newPassword, newRetypedPassword, userDetails );
    }

    render() {
        const {
            name, email, newPassword, newRetypedPassword, validationErrors,
            showModal, uploadedImage,
        } = this.state;
        const {
            name: invalidName, email: invalidEmail, newPassword: invalidNewPassword,
            newRetypedPassword: invalidNewRetypedPassword,
        } = validationErrors;

        const { error, user } = this.props.options;
        const { password } = user;

        return (
            <div className="settings-page">
                { showModal &&
                    <Modal
                        title="There are unsaved changes!"
                        subtitle="Are you sure you want to leave?"
                        acceptButtonText="Leave"
                        cancelButtonText="Stay"
                        onAcceptHandler={ this.onModalLeaveClick }
                        onCancelHandler={ this.onModalStayClick }
                    />
                }

                <header className="profile-header settings-header">
                    <button className="back-button" onClick={ this.handleBackClick }>
            Back to profile
                    </button>
                    <div className="header-user-info">
                        <img src={ defaultAvatar } alt="avatar" className="user-icon" />
                        <span>email@email.com</span>
                    </div>
                </header>

                <main className="settings-container">
                    <h1 className="settings-title">Account
                        <span className="special-text"> Settings</span>
                    </h1>
                    <div className="settings-block">
                        <h3 className="settings-subtitle">General information</h3>
                        <div className="user-info-container">
                            <FormInput
                                inputName="name"
                                className="input-container settings-input-container"
                                labelText="Name"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip settings-error-tooltip"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ name }
                                isMissing={ invalidName }
                            />
                            <FormInput
                                inputName="email"
                                className="input-container settings-input-container"
                                labelText="Email Address"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip settings-error-tooltip"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ email }
                                isMissing={ invalidEmail }
                            />

                        </div>

                        <SettingsAvatar
                            imageSource={ uploadedImage }
                            onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                            onRemoveImage={ this.removeImage }
                        />

                        <button
                            className="save-button"
                            onClick={ this.saveGeneralProfileChanges }
                        >Save changes
                        </button>

                    </div>

                    <div className="settings-block centered-content">
                        <h3 className="settings-subtitle">Change your password</h3>

                        <div className="user-info-container centered-content">
                            {
                                error.status &&
                                <h5 className="login-error full-width">
                                    {error.message}
                                </h5>
                            }

                            <FormInput
                                inputName="currentPassword"
                                className="input-container settings-input-container"
                                labelText="Current password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                isContentHidden
                                value={ password }
                                disabled
                            />
                            <FormInput
                                inputName="newPassword"
                                className="input-container settings-input-container"
                                labelText="New password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip full-width"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden
                                value={ newPassword }
                                isMissing={ invalidNewPassword }
                            />
                            <FormInput
                                inputName="newRetypedPassword"
                                className="input-container settings-input-container"
                                labelText="Retype new password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip full-width"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden
                                value={ newRetypedPassword }
                                isMissing={ invalidNewRetypedPassword }
                            />

                            <button
                                className="save-button"
                                onClick={ this.savePasswordChanges }
                            >Save changes
                            </button>
                        </div>
                    </div>

                </main>
            </div>

        );
    }
}

Settings.propTypes = {
    options: PropTypes.shape( {
        user: PropTypes.object.isRequired,
        handleProfileUpdate: PropTypes.func.isRequired,
        handlePasswordChange: PropTypes.func.isRequired,
        error: PropTypes.shape( {
            status: PropTypes.bool.isRequired,
            message: PropTypes.string.isRequired,
        } ).isRequired,
    } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
