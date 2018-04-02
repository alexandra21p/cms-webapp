import React from "react";
import PropTypes from "prop-types";
/* eslint jsx-a11y/label-has-for: "off" */
import { capitalize } from "../utils/helperMethods";

const FormInput = ( {
    onInputChange, className, inputName, labelText, isContentHidden,
    value, onFocus, isMissing = false, inputClass = "login-input",
    labelClass = "login-label", errorTooltipClass = "error-tooltip", disabled = false,
} ) => {
    const defaultOnChangeMethod = () => {};
    const formattedText = inputName
        .split( "" )
        .map( char => ( char.toUpperCase() === char ? ` ${ char }` : char ) )
        .join( "" );

    return (
        <div className={ className }>
            {
                isMissing ? (
                    <div className={ errorTooltipClass }>
                        { capitalize( formattedText ) } is required.
                    </div>
                ) : null
            }

            <input
                name={ inputName }
                type={ isContentHidden ? "password" : "text" }
                className={ inputClass }
                onChange={ onInputChange || defaultOnChangeMethod }
                onFocus={ onFocus || defaultOnChangeMethod }
                value={ value }
                disabled={ disabled }
            />
            <label
                htmlFor={ inputName }
                className={ labelClass }
            >{labelText}
            </label>
        </div>

    );
};

FormInput.propTypes = {
    onInputChange: PropTypes.func,
    inputName: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    isContentHidden: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    isMissing: PropTypes.bool,
    onFocus: PropTypes.func,
    inputClass: PropTypes.string,
    labelClass: PropTypes.string,
    disabled: PropTypes.bool,
    errorTooltipClass: PropTypes.string,
};

FormInput.defaultProps = {
    inputClass: "login-input",
    labelClass: "login-label",
    errorTooltipClass: "error-tooltip",
    onInputChange: () => {},
    onFocus: () => {},
    disabled: false,
    isMissing: false,
};

export default FormInput;
