/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import "../../css/settings.scss";
import "../../css/responsive.scss";

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
                currentPassword: false,
                newPassword: false,
                newRetypedPassword: false,
            },

            currentPassword: "",
            newPassword: "",
            newRetypedPassword: "",
            imagePreview: "",
            showModal: false,
        };

        this.handleBackClick = this.handleBackClick.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.notifyChanges = this.notifyChanges.bind( this );
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
        const { hideMessage } = this.props.options;

        if ( unsavedChanges ) {
            this.setState( { showModal: true } );
            return;
        }

        hideMessage();
        this.props.history.replace( "/profile" );
    }

    handleInputChange( evt ) {
        const { name, value } = evt.target;

        if ( name === "uploadedImage" ) {
            const file = evt.target.files[ 0 ];
            const reader = new FileReader();

            reader.onloadend = () => {
                this.setState( {
                    imagePreview: reader.result,
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
        const { showSuccessMessage, error, hideMessage } = this.props.options;

        this.setState( {
            validationErrors: {
                name: false,
                email: false,
                newPassword: false,
                newRetypedPassword: false,
            },
        } );

        if ( showSuccessMessage || error.status ) {
            hideMessage();
        }
    }

    notifyChanges() {
        this.setState( {
            unsavedChanges: true,
        } );
    }

    removeImage() {
        this.setState( {
            imagePreview: defaultAvatar,
            unsavedChanges: true,
        } );
    }

    saveGeneralProfileChanges() {
        const { handleProfileUpdate } = this.props.options;
        const { imagePreview } = this.state;

        const invalidEmail = this.email.value === "";
        const invalidName = this.name.value === "";

        if ( invalidName || invalidEmail ) {
            this.setState( {
                validationErrors: {
                    name: invalidName,
                    email: invalidEmail,
                },
            } );
            return;
        }

        const userDetails = decryptAppTokens();
        handleProfileUpdate( this.email.value, this.name.value, imagePreview, userDetails );

        this.setState( {
            unsavedChanges: false,
        } );
    }

    savePasswordChanges() {
        const { handlePasswordChange } = this.props.options;
        const { currentPassword, newPassword, newRetypedPassword } = this.state;

        const invalidCurrentPassword = currentPassword === "";
        const invalidNewPassword = newPassword === "";
        const invalidRetypedPassword = newRetypedPassword === "";

        if ( invalidCurrentPassword || invalidNewPassword || invalidRetypedPassword ) {
            this.setState( {
                validationErrors: {
                    currentPassword: invalidCurrentPassword,
                    newPassword: invalidNewPassword,
                    newRetypedPassword: invalidRetypedPassword,
                },
            } );
            return;
        }

        const userDetails = decryptAppTokens();

        handlePasswordChange( currentPassword, newPassword, newRetypedPassword, userDetails );

        this.setState( {
            unsavedChanges: false,
        } );
    }

    render() {
        const {
            currentPassword, newPassword, newRetypedPassword, validationErrors,
            showModal, imagePreview,
        } = this.state;
        const {
            name: invalidName, email: invalidEmail,
            currentPassword: invalidCurrentPassword, newPassword: invalidNewPassword,
            newRetypedPassword: invalidNewRetypedPassword,
        } = validationErrors;

        const { error, user, showSuccessMessage } = this.props.options;
        const { displayName, avatar, providers } = user;
        const { email } = providers[ 0 ];

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
                        <img src={ avatar } alt="avatar" className="user-icon" />
                        <span>{ email }</span>
                    </div>
                </header>

                <main className="settings-container">
                    <h1 className="settings-title">Account
                        <span className="special-text"> Settings</span>
                    </h1>
                    <div className="settings-block">
                        <h3 className="settings-subtitle">General information</h3>
                        <div className="user-info-container">
                            {
                                ( error.status &&
                                <h5 className="notification-message error full-width">
                                    {error.message}
                                </h5> ) ||
                            ( showSuccessMessage &&
                                <h5
                                    className="notification-message full-width"
                                >
                            Your changes were successful!
                                </h5> )
                            }
                            <FormInput
                                inputName="name"
                                className="input-container settings-input-container"
                                labelText="Name"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip full-width"
                                isMissing={ invalidName }
                                onlyDefaultValue
                                value={ displayName }
                                onInputChange={ this.notifyChanges }
                                onFocus={ this.handleInputFocus }
                                refMethod={ ( input ) => { this.name = input; } }
                            />
                            <FormInput
                                inputName="email"
                                className="input-container settings-input-container"
                                labelText="Email Address"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip full-width"
                                onlyDefaultValue
                                value={ email }
                                onInputChange={ this.notifyChanges }
                                onFocus={ this.handleInputFocus }
                                isMissing={ invalidEmail }
                                refMethod={ ( input ) => { this.email = input; } }
                            />

                        </div>

                        <SettingsAvatar
                            imageSource={ imagePreview || avatar }
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
                                ( error.status &&
                                <h5 className="notification-message error full-width">
                                    {error.message}
                                </h5> ) ||
                                ( showSuccessMessage &&
                                    <h5
                                        className="notification-message full-width"
                                    >
                                Your changes were successful!
                                    </h5> )
                            }

                            <FormInput
                                inputName="currentPassword"
                                className="input-container settings-input-container"
                                labelText="Current password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                errorTooltipClass="error-tooltip full-width"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden
                                isMissing={ invalidCurrentPassword }
                                value={ currentPassword }
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
                                isMissing={ invalidNewPassword }
                                value={ newPassword }
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
                                isMissing={ invalidNewRetypedPassword }
                                value={ newRetypedPassword }
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
        showSuccessMessage: PropTypes.bool.isRequired,
        hideMessage: PropTypes.func.isRequired,
        error: PropTypes.shape( {
            status: PropTypes.bool.isRequired,
            message: PropTypes.string.isRequired,
        } ).isRequired,
    } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
