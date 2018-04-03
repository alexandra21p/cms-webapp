/* eslint jsx-a11y/label-has-for: "off" */
import React from "react";
import PropTypes from "prop-types";

// import { defaultAvatar } from "../utils/helperMethods";

const SettingsAvatar = ( { imageSource, onInputChange, onRemoveImage } ) => (
    <div className="update-avatar-container">
        <img
            src={ imageSource }
            alt="avatar"
            className="settings-avatar"
        />
        <input
            id="file"
            name="uploadedImage"
            className="file-upload"
            type="file"
            accept=".jpg, .jpeg, .png"
            multiple={ false }
            onChange={ onInputChange }
        />
        <label htmlFor="file" className="upload-button">Upload image</label>
        <button
            className="remove-image-button"
            onClick={ onRemoveImage }
        >Remove picture
        </button>
    </div>
);

export default SettingsAvatar;

SettingsAvatar.propTypes = {
    imageSource: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onRemoveImage: PropTypes.func.isRequired,
};
