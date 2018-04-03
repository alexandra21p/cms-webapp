import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Home = ( { options: { hideMessage } } ) => (
    <div className="home-container">
        <h1>Creating websites should be<br />
            <span className="colored-text"> fast and easy</span>
        </h1>
        <div className="separator">
            <h3>So let us take care of it for you.</h3>
            <Link to="/login" className="get-started" onClick={ hideMessage }>Get Started</Link>
        </div>
    </div>
);

export default Home;

Home.propTypes = {
    options: PropTypes.shape( {
        hideMessage: PropTypes.func.isRequired,
    } ).isRequired,
};
