import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Particles from "react-particles-js";
import { connect } from "react-redux";

import particlesConfig from "../utils/particlesConfig";
import * as messageActions from "../redux/actions/messageActions";

const Home = ( { hideMessage } ) => (
    <div className="home-container">
        <Particles
            params={ particlesConfig }
        />
        <h1 className="home-title">Creating websites should be<br />
            <span className="colored-text"> fast and easy</span>
        </h1>
        <div className="separator">
            <h3>So let us take care of it for you.</h3>
            <Link to="/login" className="get-started" onClick={ hideMessage }>Get Started</Link>
        </div>

    </div>
);

Home.propTypes = {
    hideMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = ( dispatch ) => ( {
    hideMessage: () => dispatch( messageActions.hideMessage() ),
} );

export default connect( null, mapDispatchToProps )( Home );
