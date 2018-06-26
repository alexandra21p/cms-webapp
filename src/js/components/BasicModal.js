import React from "react";
import PropTypes from "prop-types";

const BasicModal = ( {
    title, subtitle, modalContainerStyle, modalContentStyle, closeHandler,
} ) => (
    <div className={ modalContainerStyle }>
        <div className={ modalContentStyle }>
            <h2 className="modal-text">{title} <br />
                <span className="designer-modal-subtitle">
                    {subtitle}
                </span>
            </h2>
            <button
                className="confirm-button"
                onClick={ closeHandler }
            >Got it
            </button>
        </div>
    </div>
);

export default BasicModal;

BasicModal.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    modalContainerStyle: PropTypes.string.isRequired,
    modalContentStyle: PropTypes.string.isRequired,
    closeHandler: PropTypes.func.isRequired,
};
