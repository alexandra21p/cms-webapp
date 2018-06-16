import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import { decryptAppTokens } from "../utils/helperMethods";
import "../../css/profile.scss";

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleLogout = this.handleLogout.bind( this );
    }

    componentDidMount() {
        const userData = decryptAppTokens();
        this.props.getUserProfile( userData );
    }
    handleLogout() {
        const {
            email, provider, decryptedToken, decryptedSocialToken,
        } = decryptAppTokens();

        this.props.logoutUser( {
            email, provider, decryptedToken, decryptedSocialToken,
        } )
            .then( () => {
                this.props.history.replace( "/login" );
            } );
    }

    showCreatedSites() {
        console.log( this );
        return (
            <div className="empty-container">
                <h2 className="no-websites-message">
                You haven&apos;t created any websites yet. <br /> Let&apos;s change that.
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
        const { user: { avatar, displayName } } = this.props;
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
    logoutUser: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired, // eslint-disable-line
    history: PropTypes.object.isRequired, // eslint-disable-line
};

const mapStateToProps = ( state ) => ( {
    user: state.user.userData,
} );

const mapDispatchToProps = ( dispatch ) => ( {
    getUserProfile: userData => dispatch( userActions.getUserProfile( userData ) ),
    logoutUser: userData => dispatch( userActions.logoutUser( userData ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Profile );
