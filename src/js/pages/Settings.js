/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";
import "../../css/settings.css";

export default class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            // uploadedImage: "",
            unsavedChanges: false,
        };

        this.handleBackClick = this.handleBackClick.bind( this );
    }

    handleBackClick() {
        const { unsavedChanges } = this.state;
        if ( unsavedChanges ) {
            alert( "There are unsaved changes!" );
            return;
        }
        this.props.history.replace( "/profile" );
    }

    render() {
        return (
            <div className="settings-page">
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
                            <p>name and email stuff</p>
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
