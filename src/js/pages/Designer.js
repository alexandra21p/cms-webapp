import React from "react";
import PropTypes from "prop-types";
import "../../css/designer.css";

export default class Designer extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: true,
            showModalContainer: true,
        };

        this.closeModal = this.closeModal.bind( this );
    }

    closeModal() {
        this.setState( { showModal: false } );
        setTimeout( () => this.setState( { showModalContainer: false } ), 400 );
    }

    render() {
        const { user: { displayName } } = this.props.options;
        const { showModal, showModalContainer } = this.state;
        const modalStyle = showModal ?
            "designer-welcome-box" : "designer-welcome-box slide-out";
        const modalContainerStyle = showModalContainer ?
            "modal-container flex" : "modal-container hidden-modal-container";

        return (
            <div className="designer-page">

                <div className={ modalContainerStyle }>
                    <div className={ modalStyle }>
                        <h2 className="modal-text">Hey there, {displayName}! <br />
                            <span className="designer-modal-subtitle">
                            This is the designer page, where the magic happens.
                            </span>
                        </h2>
                        <button
                            className="confirm-button"
                            onClick={ this.closeModal }
                        >Got it
                        </button>
                    </div>
                </div>

                <h1>Random text here on the designer page, just to fill this space a bit.</h1>
            </div>
        );
    }
}

Designer.propTypes = {
    options: PropTypes.shape( {
        getUserProfile: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    } ).isRequired,
    // history: PropTypes.object.isRequired, // eslint-disable-line
};
