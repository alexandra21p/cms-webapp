import React from "react";
import { Link } from "react-router-dom";

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        console.log( this );
        return (
            <div className="home-container">
                <h1>Creating websites should be<br />
                    <span className="colored-text"> fast and easy</span>
                </h1>
                <div className="separator">
                    <h3>So let us take care of it for you.</h3>
                    <Link to="/login" className="get-started">Get Started</Link>
                </div>
            </div>
        );
    }
}
