import React from "react";
import PropTypes from "prop-types";

class BasicModal extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
        };

        this.onConfirm = this.onConfirm.bind( this );
    }

    onConfirm() {
        const { closeHandler } = this.props;
        const name = this.state.name || "cool default name";
        closeHandler( name );
    }

    render() {
        const {
            title, subtitle, modalContainerStyle, modalContentStyle,
        } = this.props;

        return (
            <div className={ modalContainerStyle }>
                <div className={ modalContentStyle }>
                    <h2 className="modal-text">{title} <br />
                        <span className="designer-modal-subtitle">
                            {subtitle}
                        </span>
                    </h2>
                    <div className="site-name-container">
                        <h3 className="site-name-subtitle">But first, let{"'"}s choose a name for your new page!
                        </h3>
                        <input
                            name="siteName"
                            type="text"
                            className="modal-input"
                            onChange={ ( evt ) => { this.setState( { name: evt.target.value } ); } }
                            value={ this.state.name }
                        />
                    </div>
                    <button
                        className="confirm-button"
                        onClick={ this.onConfirm }
                    >OK
                    </button>
                </div>
            </div>
        );
    }
}

export default BasicModal;

BasicModal.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    modalContainerStyle: PropTypes.string.isRequired,
    modalContentStyle: PropTypes.string.isRequired,
    closeHandler: PropTypes.func.isRequired,
};
