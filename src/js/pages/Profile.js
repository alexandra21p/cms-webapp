import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { decryptToken } from "../utils/helperMethods";
import "../../css/profile.css";

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {

        };

        this.handleLogout = this.handleLogout.bind( this );
    }

    componentDidMount() {
        const { getUserProfile } = this.props.options;
        const { id } = JSON.parse( localStorage.getItem( "userDetails" ) );
        const token = localStorage.getItem( "auth" );

        const reversedId = id.split( "" ).reverse().join( "" );
        const decryptedToken = decryptToken( token, id, reversedId );

        getUserProfile( decryptedToken, id );
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
                <Link
                    className="profile-navigation-button"
                    to="/designer"
                >
                Create a new site
                </Link>
            </div>
        );
    }

    render() {
        const { user: { avatar, displayName } } = this.props.options;
        return (
            <div className="profile-page">
                <header className="profile-header">
                    <h3 className="profile-welcome-message">Hello, { displayName }!</h3>
                    <button className="logout-button" onClick={ this.handleLogout }>
                logout
                    </button>
                </header>

                <div className="profile-container">
                    <aside className="sidebar">
                        <img src={ avatar } alt="avatar" className="avatar" />
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
    options: PropTypes.shape( {
        getUserProfile: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
