import React from "react";
import PropTypes from "prop-types";

const Modal = ( {
    title, subtitle, acceptButtonText, cancelButtonText, onCancelHandler, onAcceptHandler,
} ) => (
    <div className="modal-container">
        <div className="popup-modal">
            <h4 className="modal-title">{title}</h4>
            <h5 className="modal-subtitle">{subtitle}</h5>
            <button
                className="login-button modal-button"
                onClick={ onAcceptHandler }
            >{acceptButtonText}
            </button>
            <button
                className="login-button modal-button"
                onClick={ onCancelHandler }
            >{cancelButtonText}
            </button>
        </div>
    </div>
);

export default Modal;

Modal.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    acceptButtonText: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string.isRequired,
    onAcceptHandler: PropTypes.func.isRequired,
    onCancelHandler: PropTypes.func.isRequired,
};
