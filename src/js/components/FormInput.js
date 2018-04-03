/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";

import { capitalize } from "../utils/helperMethods";

const FormInput = ( { /* eslint complexity: "off" */
    onInputChange, className, inputName, labelText,
    value, onFocus, refMethod = null, isMissing = false, inputClass = "login-input",
    labelClass = "login-label", errorTooltipClass = "error-tooltip",
    disabled = false, onlyDefaultValue = false, isContentHidden = false,
} ) => {
    // const defaultOnChangeMethod = null;
    const [ defaultValue, givenValue ] = onlyDefaultValue ?
        [ value, undefined ] : [ undefined, value ];
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
                onChange={ onInputChange }
                onFocus={ onFocus }
                defaultValue={ defaultValue }
                value={ givenValue }
                disabled={ disabled }
                ref={ refMethod }
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
    onInputChange: PropTypes.func.isRequired,
    inputName: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    isContentHidden: PropTypes.bool,
    value: PropTypes.string.isRequired,
    isMissing: PropTypes.bool,
    onFocus: PropTypes.func.isRequired,
    refMethod: PropTypes.func,
    inputClass: PropTypes.string,
    labelClass: PropTypes.string,
    disabled: PropTypes.bool,
    errorTooltipClass: PropTypes.string,
    onlyDefaultValue: PropTypes.bool,
};

FormInput.defaultProps = {
    inputClass: "login-input",
    labelClass: "login-label",
    errorTooltipClass: "error-tooltip",
    disabled: false,
    isMissing: false,
    onlyDefaultValue: false,
    isContentHidden: false,
    refMethod: null,
};

export default FormInput;
