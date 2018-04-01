import React from "react";
import PropTypes from "prop-types";
/* eslint jsx-a11y/label-has-for: "off" */
import { capitalize } from "../utils/helperMethods";

const FormInput = ( {
    onInputChange, className, inputName, labelText, isContentHidden,
    value, isMissing, onFocus, inputClass = "login-input", labelClass = "login-label",
} ) => (
    <div className={ className }>
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
            className={ inputClass }
            onChange={ onInputChange }
            onFocus={ onFocus }
            value={ value }
        />
        <label
            htmlFor={ inputName }
            className={ labelClass }
        >{labelText}
        </label>
    </div>

);

FormInput.propTypes = {
    onInputChange: PropTypes.func.isRequired,
    inputName: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    isContentHidden: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    isMissing: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
    inputClass: PropTypes.string,
    labelClass: PropTypes.string,
};

FormInput.defaultProps = {
    inputClass: "login-input",
    labelClass: "login-label",
};
export default FormInput;
