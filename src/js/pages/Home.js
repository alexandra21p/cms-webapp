import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Particles from "react-particles-js";
import { connect } from "react-redux";

import particlesConfig from "../utils/particlesConfig";
import * as messageActions from "../redux/actions/messageActions";
import "../../css/responsive.scss";

const Home = ( { hideMessage } ) => (
    <div className="home-container">
        <div className="home-content">
            <h1 className="home-title">Creating websites <br />should be</h1>
            <div className="separator" >
                <Link
                    to="/login"
                    className="get-started"
                    onClick={ hideMessage }
                >give it a try now
                </Link>
            </div>
        </div>
        <Particles
            params={ particlesConfig }
        />
        <div className="middle-container">
            <div className="circle" >
                <span className="colored-text"> fast
                    <span className="cross-text">+</span> <br />easy
                </span>
            </div>

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
