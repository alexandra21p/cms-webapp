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
        const {
            id, socialAuthToken, provider,
        } = JSON.parse( localStorage.getItem( "userDetails" ) );
        const token = localStorage.getItem( "auth" );

        const reversedId = id.split( "" ).reverse().join( "" );
        const decryptedToken = decryptToken( token, id, reversedId );
        const decryptedSocialToken = socialAuthToken ?
            decryptToken( socialAuthToken, id, reversedId ) : "";

        getUserProfile( id, provider, decryptedToken, decryptedSocialToken );
    }

    handleLogout() {
        const { handleLogout } = this.props.options;
        const {
            id, socialAuthToken, email, provider,
        } = JSON.parse( localStorage.getItem( "userDetails" ) );
        const token = localStorage.getItem( "auth" );

        const reversedId = id.split( "" ).reverse().join( "" );
        const decryptedSocialToken = socialAuthToken ?
            decryptToken( socialAuthToken, id, reversedId ) : "";
        const decryptedToken = decryptToken( token, id, reversedId );

        handleLogout( email, provider, decryptedToken, decryptedSocialToken );
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
        const { email } = JSON.parse( localStorage.getItem( "userDetails" ) );

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
                        <span className="profile-email">{email}</span>
                        <nav className="profile-side-navigation">
                            <li className="profile-navigation-item">
                                <Link to="/settings" className="profile-nav-link" >
                                Account Settings
                                </Link>
                            </li>
                        </nav>
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
        handleLogout: PropTypes.func.isRequired,
    } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
