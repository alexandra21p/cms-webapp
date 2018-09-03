import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import TemplateComponent from "../components/TemplateComponent";

class Preview extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const { rootComponent } = this.props.template;
        return (
            <div style={ { height: "100%" } }>
                <Link
                    to="/designer"
                    style={ {
                        fontFamily: "Julius Sans One",
                        color: "#252434",
                        padding: "15px 20px 11px",
                        backgroundColor: "#fb9a88",
                        textDecoration: "none",
                        fontSize: "1.1rem",
                        borderRadius: "50px",
                        position: "fixed",
                        top: "30px",
                        left: "30px",
                        width: "130px",
                        textAlign: "center",
                        boxShadow: "1px 2px 6px 0px rgba(0, 0, 0, .3)",
                    } }
                >back to editor
                </Link>

                {[ rootComponent ].map( comp => (
                    <TemplateComponent key={ comp._id } { ...comp } />
                ) )}
            </div>
        );
    }
}
Preview.propTypes = {
    template: PropTypes.object.isRequired,
};

const mapStateToProps = ( state ) => ( {
    template: state.templates.currentTemplate,
} );

export default connect( mapStateToProps, null )( Preview );
