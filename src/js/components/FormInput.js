import React from "react";
import PropTypes from "prop-types";
/* eslint jsx-a11y/label-has-for: "off" */
import { capitalize } from "../utils/helperMethods";

const FormInput = ( {
    onInputChange, inputName, labelText, isContentHidden, value, isMissing, onFocus,
} ) => (
    <div className="input-container">
        {
            isMissing ? (
                <div className="error-tooltip">
                    { capitalize( inputName ) } is required.
                </div>
            ) : null
        }

        <input
            name={ inputName }
            type={ isContentHidden ? "password" : "text" }
            className="login-input"
            onChange={ onInputChange }
            onFocus={ onFocus }
            value={ value }
        />
        <label
            htmlFor={ inputName }
            className="login-label"
        >{labelText}
        </label>
    </div>

);

FormInput.propTypes = {
    onInputChange: PropTypes.func.isRequired,
    inputName: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    isContentHidden: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    isMissing: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
};

export default FormInput;
