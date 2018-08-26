/* eslint 'jsx-a11y/no-static-element-interactions': 0,
'jsx-a11y/click-events-have-key-events': 0, 'no-nested-ternary': 0 */
import React from "react";
import PropTypes from "prop-types";

class ElementEditPanel extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
        };
    }

    render() {
        const { visible, toggleHandler, data } = this.props;
        console.log( data.text );
        const panelOffset = visible ? "25px" : "-100px";

        return (
            <div
                className="hamburger-menu-toggle edit-panel"
                style={ { left: panelOffset } }
            >
                <input
                    type="checkbox"
                    value={ visible }
                    checked={ visible }
                    onChange={ toggleHandler }
                />
                <span />
                <span />
                <span />

                <div className="hamburger-content edit-panel-content">
                    <div style={ { marginTop: "20px" } }>{data.id}</div>
                    <input
                        type="text"
                        style={ { marginTop: "20px" } }
                        value={ data.text }
                    />
                </div>
            </div>
        );
    }
}

ElementEditPanel.propTypes = {
    toggleHandler: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object,
};

ElementEditPanel.defaultProps = {
    data: {},
};
export default ElementEditPanel;
