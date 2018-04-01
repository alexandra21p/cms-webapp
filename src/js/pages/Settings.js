/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import "../../css/settings.css";
import "../../css/responsive.css";

import FormInput from "../components/FormInput";

export default class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            // uploadedImage: "",
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
            showModal: false,
        };

        this.handleBackClick = this.handleBackClick.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleInputFocus = this.handleInputFocus.bind( this );
        this.onModalLeaveClick = this.onModalLeaveClick.bind( this );
        this.onModalStayClick = this.onModalStayClick.bind( this );
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

    render() {
        const {
            name, email, newPassword, newRetypedPassword, validationErrors, showModal,
        } = this.state;
        const {
            name: invalidName, email: invalidEmail, newPassword: invalidNewPassword,
            newRetypedPassword: invalidNewRetypedPassword,
        } = validationErrors;
        return (
            <div className="settings-page">
                { showModal &&
                    <div className="modal-container">
                        <div className="popup-modal">
                            <h4 className="modal-title">There are unsaved changes!</h4>
                            <h5 className="modal-subtitle">Are you sure you want to leave?</h5>
                            <button
                                className="login-button modal-button"
                                onClick={ this.onModalLeaveClick }
                            >Leave
                            </button>
                            <button
                                className="login-button modal-button"
                                onClick={ this.onModalStayClick }
                            >Stay
                            </button>
                        </div>
                    </div>

                }
                <header className="profile-header settings-header">
                    <button className="back-button" onClick={ this.handleBackClick }>
            Back to profile
                    </button>
                    <div className="header-user-info">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX" alt="avatar" className="user-icon" />
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
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ email }
                                isMissing={ invalidEmail }
                            />

                        </div>
                        <div className="update-avatar-container">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX" alt="avatar" className="settings-avatar" />
                            <input
                                id="file"
                                className="file-upload"
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                multiple={ false }
                            />
                            <label htmlFor="file" className="upload-button">Upload image</label>
                            <h5 className="remove-image-button">Remove picture</h5>
                        </div>

                        <button
                            className="save-button"
                            onClick={ this.saveChanges }
                        >Save changes
                        </button>

                    </div>

                    <div className="settings-block centered-content">
                        <h3 className="settings-subtitle">Change your password</h3>
                        <div className="user-info-container centered-content">
                            <FormInput
                                inputName="currentPassword"
                                className="input-container settings-input-container"
                                labelText="Current password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                onInputChange={ ( ) => {} }
                                onFocus={ () => {} }
                                isContentHidden
                                value="blabla"
                                isMissing={ false }
                            />
                            <FormInput
                                inputName="newPassword"
                                className="input-container settings-input-container"
                                labelText="New password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ newPassword }
                                isMissing={ invalidNewPassword }
                            />
                            <FormInput
                                inputName="newRetypedPassword"
                                className="input-container settings-input-container"
                                labelText="Retype new password"
                                labelClass="login-label settings-label"
                                inputClass="login-input settings-input"
                                onInputChange={ ( evt ) => this.handleInputChange( evt ) }
                                onFocus={ this.handleInputFocus }
                                isContentHidden={ false }
                                value={ newRetypedPassword }
                                isMissing={ invalidNewRetypedPassword }
                            />

                            <button
                                className="save-button"
                                onClick={ this.saveChanges }
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
    // options: PropTypes.shape( {
    //     getUserProfile: PropTypes.func.isRequired,
    //     user: PropTypes.object.isRequired,
    //     handleLogout: PropTypes.func.isRequired,
    // } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
