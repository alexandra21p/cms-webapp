import React from "react";
import PropTypes from "prop-types";
import { decryptToken } from "../utils/helperMethods";
import "../../css/designer.css";

export default class Designer extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    componentDidMount() {
        const { getUserProfile } = this.props.options;
        const { id } = JSON.parse( localStorage.getItem( "userDetails" ) );
        const token = localStorage.getItem( "auth" );

        const reversedId = id.split( "" ).reverse().join( "" );
        const decryptedToken = decryptToken( token, id, reversedId );

        getUserProfile( decryptedToken, id );
    }

    render() {
        const { user: { avatar, displayName } } = this.props.options;
        return (
            <div className="designer-page">
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

Designer.propTypes = {
    options: PropTypes.shape( {
        getUserProfile: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    } ).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
};
