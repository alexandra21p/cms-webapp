import React from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import "../../css/settings.css";

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        return (
            <div className="settings-page">
                <header className="profile-header settings-header">
                    <button className="back-button" onClick={ this.handleLogout }>
            back to profile
                    </button>
                    <div className="header-user-info">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX" alt="avatar" className="user-icon" />
                        <span>email@email.com</span>
                    </div>
                </header>
            </div>

        );
    }
}
//
// Settings.propTypes = {
//     options: PropTypes.shape( {
//         getUserProfile: PropTypes.func.isRequired,
//         user: PropTypes.object.isRequired,
//         handleLogout: PropTypes.func.isRequired,
//     } ).isRequired,
//     history: PropTypes.object.isRequired, // eslint-disable-line
// };
