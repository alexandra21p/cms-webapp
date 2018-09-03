import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import * as templateActions from "../redux/actions/templateActions";
import * as messageActions from "../redux/actions/messageActions";

import { decryptAppTokens } from "../utils/helperMethods";
import "../../css/profile.scss";

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            menuToggle: true,
        };

        this.handleLogout = this.handleLogout.bind( this );
        this.showCreatedSites = this.showCreatedSites.bind( this );
        this.goToTemplate = this.goToTemplate.bind( this );
        this.onMenuToggle = this.onMenuToggle.bind( this );
        this.goToDesigner = this.goToDesigner.bind( this );
        this.onDeleteTemplate = this.onDeleteTemplate.bind( this );
    }

    componentDidMount() {
        const userData = decryptAppTokens();
        this.props.getUserProfile( userData );
    }

    onDeleteTemplate( id ) {
        const userData = decryptAppTokens();
        this.props.deleteTemplate( userData, id );
    }

    onMenuToggle() {
        this.setState( {
            menuToggle: !this.state.menuToggle,
        } );
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

    goToTemplate( evt, templateId ) {
        if ( evt.target.className === "delete-site-button" ) {
            return;
        }
        const { getTemplateData } = this.props;
        getTemplateData( templateId )
            .then( () => { this.props.history.replace( "/designer" ); } );
    }

    goToDesigner() {
        this.props.showTemplateCreationModal();
    }

    showCreatedSites() {
        const { templates } = this.props;
        const siteDivs = templates.map( template =>
            (
                <div
                    className="website-wrapper"
                    key={ template._id }
                    onClick={ ( evt ) => { this.goToTemplate( evt, template._id ); } }
                >
                    <h4>{template.name}</h4>
                    <button
                        className="delete-site-button"
                        onClick={ () => {
                            this.onDeleteTemplate( template._id );
                        } }
                    />
                </div>
            ) );

        return (
            <div className="websites-container">
                {siteDivs}
                <div className="new-site-wrapper">
                    <Link
                        className="profile-navigation-button"
                        to="/designer"
                        onClick={ this.goToDesigner }
                    >Create a new site
                    </Link>
                </div>
            </div>
        );
    }

    render() {
        const { menuToggle } = this.state;
        const { user: { avatar, displayName }, templates } = this.props;
        const { email } = JSON.parse( localStorage.getItem( "userDetails" ) );
        const welcomeMessage = displayName ? `Hello, ${ displayName }!` : "Hello there!";
        const mainContainerOffset = menuToggle ? "230px" : "30px";

        return (
            <div className="profile-page">
                <header className="profile-header">
                    <h3 className="profile-welcome-message">
                        {welcomeMessage} Nice seeing you here!
                    </h3>
                    <button className="logout-button" onClick={ this.handleLogout }>
                logout
                    </button>
                </header>

                <div className="profile-container">
                    <aside className="sidebar">
                        <div className="hamburger-menu-toggle">
                            <input
                                type="checkbox"
                                checked={ menuToggle }
                                onChange={ this.onMenuToggle }
                            />
                            <span />
                            <span />
                            <span />

                            <div className="hamburger-content">
                                <img src={ avatar } alt="avatar" className="avatar" />
                                <h6 className="sidebar-subtitle">your details</h6>
                                <span className="profile-email">{email}</span>
                                <nav className="profile-side-navigation">
                                    <li className="profile-navigation-item">
                                        <Link to="/settings" className="profile-nav-link" >
                                  Account Settings
                                        </Link>
                                    </li>
                                </nav>
                            </div>
                        </div>
                    </aside>

                    <main
                        className="profile-main-container"
                        style={ { marginLeft: mainContainerOffset } }
                    >
                        { templates.length > 0 ? this.showCreatedSites() :
                            (
                                <div className="empty-container">
                                    <h2 className="no-websites-message">
                                    You&apos;re not currently working on any template. <br /> Let&apos;s change that.
                                    </h2>
                                    <Link
                                        className="profile-navigation-button"
                                        to="/designer"
                                        onClick={ this.goToDesigner }
                                    >Create a new site
                                    </Link>
                                </div>
                            )
                        }
                    </main>
                </div>
            </div>

        );
    }
}

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    templates: PropTypes.array.isRequired,
    // getAllTemplatesByUser: PropTypes.func.isRequired,
    deleteTemplate: PropTypes.func.isRequired,
    getTemplateData: PropTypes.func.isRequired,
    showTemplateCreationModal: PropTypes.func.isRequired,
};

const mapStateToProps = ( state ) => ( {
    user: state.user.userData,
    templates: state.templates.allTemplates,
} );

const mapDispatchToProps = ( dispatch ) => ( {
    getUserProfile: userData => dispatch( userActions.getUserProfile( userData ) ),
    logoutUser: userData => dispatch( userActions.logoutUser( userData ) ),
    getAllTemplatesByUser: userId => dispatch( templateActions.getAllTemplatesByUser( userId ) ),
    deleteTemplate: ( userData, templateId ) =>
        dispatch( templateActions.deleteTemplate( userData, templateId ) ),
    getTemplateData: ( templateId ) =>
        dispatch( templateActions.getTemplateData( templateId ) ),
    showTemplateCreationModal: () =>
        dispatch( messageActions.showTemplateCreationModal() ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Profile );
