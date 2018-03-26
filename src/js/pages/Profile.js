import React from "react";
import PropTypes from "prop-types";

import "../../css/profile.css";

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {

        };

        this.handleLogout = this.handleLogout.bind( this );
    }

    handleLogout() {
        localStorage.removeItem( "auth" );
        localStorage.removeItem( "userDetails" );
        this.props.history.replace( "/login" );
    }

    showCreatedSites() {
        console.log( this );
        return (
            <div className="empty-container">
                <h2 className="no-websites-message">
                You haven&apos;t created any websites yet. Let&apos;s change that.
                </h2>
                <button className="profile-button">Create a new site</button>
            </div>
        );
    }

    render() {
        return (
            <div className="profile-page">
                <header className="profile-header">
                    <button className="login-button" onClick={ this.handleLogout }>
                logout
                    </button>
                </header>

                <div className="profile-container">
                    <aside className="sidebar">
                        <img src="" alt="avatar" className="avatar" />
                    </aside>

                    <main className="profile-main-container">
                        { this.showCreatedSites() }
                    </main>
                </div>
            </div>

        );
    }
}

Profile.propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line
};
