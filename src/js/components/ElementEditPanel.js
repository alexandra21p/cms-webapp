/* eslint 'jsx-a11y/no-static-element-interactions': 0,
'jsx-a11y/click-events-have-key-events': 0, 'no-nested-ternary': 0 */
import React from "react";
import PropTypes from "prop-types";
import { BlockPicker } from "react-color";
import omit from "lodash.omit";
import { FormatAlignLeftIcon, FormatAlignCenterIcon,
    FormatAlignRightIcon, FormatAlignJustifyIcon, FormatBoldIcon,
    FormatItalicIcon, FormatUnderlineIcon, FormatColorFillIcon } from "mdi-react";

import { BaseElement } from "./TemplateComponent";

const availableFonts = [
    "Raleway", "Open Sans", "Lato", "Noto Sans", "Montserrat",
];

const fontSizes = [
    8, 9, 10, 11, 12, 14, 18, 22, 24, 30, 36, 48, 60, 72,
];

const textFormatting = {
    bold: "font-weight",
    italic: "font-style",
    underline: "text-decoration",
};

const initialState = {
    text: "",
    attributes: {},
    styles: {},
    backgroundColor: "",
    color: "",
    hasChanged: false,
    textStyles: {
        bold: false,
        italic: false,
        underline: false,
    }, // bold, italic, underline
    partiallyHidden: false,
};

const renderChildren = ( data ) => data.map( ( {
    tag, styles, attributes, text, childElements,
} ) => {
    const StyledElement = BaseElement.withComponent( tag || "div" );

    const additionalProps = attributes ? { ...attributes, styles } : { styles };

    return tag === "img" ? <StyledElement { ...additionalProps } /> :
        (
            <StyledElement
                { ...additionalProps }
            >
                {text && text}
                {childElements && renderChildren( childElements )}
            </StyledElement>
        );
} );

class ElementEditPanel extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            text: "",
            attributes: {},
            styles: {},
            backgroundColor: "",
            color: "",
            hasChanged: false,
            textStyles: {
                bold: false,
                italic: false,
                underline: false,
            }, // bold, italic, underline
            visibleFontSelection: false,
            visibleFontSizeSelection: false,
            partiallyHidden: false,
            // StyledElement: BaseElement.withComponent( "div" ),

        };

        this.StyledElement = BaseElement.withComponent( "div" );
        this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind( this );
        this.handleTextColorChange = this.handleTextColorChange.bind( this );
        this.setTextAlignment = this.setTextAlignment.bind( this );
        this.setTextStyles = this.setTextStyles.bind( this );
        this.selectFont = this.selectFont.bind( this );
        this.selectFontSize = this.selectFontSize.bind( this );
        this.onCancel = this.onCancel.bind( this );
        this.setItemsAlignment = this.setItemsAlignment.bind( this );
        this.toggleEditPanel = this.toggleEditPanel.bind( this );
        this.renderStyledComponent = this.renderStyledComponent.bind( this );
        this.saveChanges = this.saveChanges.bind( this );
        this.onImageChange = this.onImageChange.bind( this );
        this.setFlexDirection = this.setFlexDirection.bind( this );
    }

    componentDidUpdate( prevProps ) {
        if ( !this.props.visible && this.props.visible !== prevProps.visible ) {
            this.setState( { ...initialState } ); // eslint-disable-line
        // } else if ( this.props.data._id !== prevProps.data._id ) {
        //     this.setState( {StyledElement: BaseElement.withComponent( this.props.data.tag || 'div' ) } ); // eslint-disable-line
        }
    }

    onCancel() {
        const { toggleHandler } = this.props;
        this.setState( { ...initialState } );
        toggleHandler();
    }

    onImageChange( evt ) {
        const { name, value } = evt.target;
        const { attributes } = this.props.data;
        if ( !value || !evt.target.files[ 0 ] ) {
            return;
        }
        if ( name === "uploadedImage" ) {
            const file = evt.target.files[ 0 ];
            const reader = new FileReader();

            reader.onloadend = () => {
                this.setState( {
                    attributes: {
                        ...attributes,
                        ...this.state.attributes,
                        src: reader.result,
                    },
                } );
            };

            reader.readAsDataURL( file );
            return;
        }

        this.setState( {
            attributes: {
                ...attributes,
                ...this.state.attributes,
                src: value,
            },
        } );
    }

    setTextAlignment( evt ) {
        const { name } = evt.currentTarget;
        this.setState( {
            styles: { ...this.state.styles, "text-align": name },
        } );
    }
    setItemsAlignment( value ) {
        this.setState( {
            styles: { ...this.state.styles, "justify-content": value },
        } );
    }
    setFlexDirection( value ) {
        this.setState( {
            styles: { ...this.state.styles, "flex-direction": value },
        } );
    }

    setTextStyles( evt ) {
        const { name } = evt.currentTarget;
        if ( !name ) {
            return;
        }
        const { textStyles, styles } = this.state;
        const updatedStyleState = !textStyles[ name ];
        const propName = textFormatting[ name ];

        const newStyles = updatedStyleState ?
            { ...styles, [ propName ]: name } :
            omit( styles, [ propName ] );

        this.setState( {
            textStyles: {
                ...this.state.textStyles,
                [ name ]: updatedStyleState,
            },
            styles: newStyles,
        } );
    }

    handleBackgroundColorChange( color ) {
        this.setState( {
            backgroundColor: color.hex,
            styles: {
                ...this.state.styles,
                "background-color": color.hex,
            },
        } );
    }
    handleTextColorChange( color ) {
        this.setState( {
            color: color.hex,
            styles: {
                ...this.state.styles,
                color: color.hex,
            },
        } );
    }

    selectFont( evt, font ) {
        this.setState( {
            styles: {
                ...this.state.styles,
                "font-family": `'${ font }', sans-serif`,
            },
            visibleFontSelection: false,
        } );
    }

    selectFontSize( evt, font ) {
        this.setState( {
            styles: {
                ...this.state.styles,
                "font-size": `${ font }px`,
            },
            visibleFontSizeSelection: false,
        } );
    }

    toggleEditPanel() {
        this.setState( { partiallyHidden: !this.state.partiallyHidden } );
    }

    saveChanges() {
        const { styles, attributes, text } = this.state;
        const {
            styles: propStyles,
            atrributes: propAttributes, _id, relatedTemplate,
        } = this.props.data;
        const changes = { styles: { ...propStyles, ...styles }, text };

        if ( attributes ) {
            changes.attributes = { ...propAttributes, ...attributes };
        }

        const fontChoice = this.state.styles[ "font-family" ] || propStyles[ "font-family" ];
        if ( fontChoice ) {
            this.props.addFontToDefaults( fontChoice );
        }
        this.props.saveEditHandler( _id, relatedTemplate, changes );
    }

    renderStyledComponent() {
        const { data } = this.props;
        const {
            text, hasChanged, attributes, styles,
            // StyledElement,
        } = this.state;

        this.StyledElement = BaseElement.withComponent( data.tag || "div" );
        const { styles: propStyles, attributes: propAttrs } = data;
        const attrs = propAttrs ? { ...propAttrs, ...attributes } : attributes;
        const updatedStyles = { ...propStyles, ...styles };
        const additionalProps = attrs ?
            {
                ...attrs,
                styles: updatedStyles,
            } : { styles: updatedStyles };

        return data.tag === "img" ?
            <this.StyledElement { ...additionalProps } />
            :
            <this.StyledElement
                { ...additionalProps }
            >
                {data.childElements && renderChildren( data.childElements )}
                {hasChanged ? text : data.text}
            </this.StyledElement>;
    }

    render() {
        const { visible, data } = this.props;
        const panelOffset = visible ? "25px" : "-100px";
        const {
            text, backgroundColor, textColorToggle,
            color, hasChanged, visibleFontSelection, visibleFontSizeSelection, imageSource,
            textStyles, styles, partiallyHidden,
        } = this.state;
        const fontDropdownDisplay = visibleFontSelection
            ? "block" : "none";
        const fontSizeDropdownDisplay = visibleFontSizeSelection ? "block" : "none";
        const leftEditClass = partiallyHidden ?
            "edit-panel-left hidden-edit-panel"
            : "edit-panel-left";
        return (
            <div
                className="hamburger-menu-toggle edit-panel"
                style={ { left: panelOffset } }
            >
                <input
                    type="checkbox"
                    checked={ visible }
                    onChange={ this.onCancel }
                />
                <span />
                <span />
                <span />

                <div className="hamburger-menu-toggle  hamburger-content edit-panel-content">
                    <button className="save-edit" onClick={ this.saveChanges } />
                    <button
                        className="toggle-panel-btn"
                        onClick={ this.toggleEditPanel }
                    >{partiallyHidden ? "show" : "hide"} edit panel
                    </button>
                    <h2 className="uppercase-heading">Component editor</h2>
                    <div className={ leftEditClass }>

                        <div className="color-picker-container">
                            <h4 className="edit-section-subtitle">change background color</h4>
                            <BlockPicker
                                color={ backgroundColor }
                                onChangeComplete={ this.handleBackgroundColorChange }
                                width="100%"
                            />
                        </div>

                        <h4 className="edit-section-subtitle">content text</h4>
                        <textarea
                            type="text"
                            className="edit-text"
                            value={ hasChanged ? text : data.text }
                            onChange={ ( evt ) => {
                                this.setState( { text: evt.target.value, hasChanged: true } );
                            } }
                        />

                        <h4 className="edit-section-subtitle">text formatting</h4>
                        <div className="format-text">
                            <button
                                className={ `${ styles[ "text-align" ] === "left"
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="left"
                                onClick={ ( evt ) => { this.setTextAlignment( evt ); } }
                            >
                                <FormatAlignLeftIcon
                                    color={ `${ styles[ "text-align" ] === "left" ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className={ `${ styles[ "text-align" ] === "center"
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="center"
                                onClick={ evt => { this.setTextAlignment( evt ); } }
                            >
                                <FormatAlignCenterIcon
                                    color={ `${ styles[ "text-align" ] === "center" ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className={ `${ styles[ "text-align" ] === "right"
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="right"
                                onClick={ evt => { this.setTextAlignment( evt ); } }
                            >
                                <FormatAlignRightIcon
                                    color={ `${ styles[ "text-align" ] === "right" ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className={ `${ styles[ "text-align" ] === "justify"
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="justify"
                                onClick={ evt => { this.setTextAlignment( evt ); } }
                            >
                                <FormatAlignJustifyIcon
                                    color={ `${ styles[ "text-align" ] === "justify" ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className="items-alignment selection-dropdown-btn"
                                onClick={ () => {
                                    this
                                        .setState( {
                                            visibleFontSizeSelection: !visibleFontSizeSelection,
                                            visibleFontSelection: false,
                                        } );
                                } }
                            >font size
                                <div
                                    style={ { display: `${ fontSizeDropdownDisplay }` } }
                                    className="selection-dropdown-content size"
                                >
                                    {fontSizes
                                        .map( size => (
                                            <span
                                                key={ size }
                                                style={ { display: `${ fontSizeDropdownDisplay }` } }
                                                onClick={ ( evt ) => { this.selectFontSize( evt, size ); } }
                                            >{size}
                                            </span> ) )}
                                </div>
                            </button>

                        </div>

                        <div className="format-text">
                            <button
                                className={ `${ textStyles.bold
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="bold"
                                onClick={ ( evt ) => { this.setTextStyles( evt ); } }
                            >
                                <FormatBoldIcon
                                    color={ `${ textStyles.bold ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className={ `${ textStyles.italic
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="italic"
                                onClick={ evt => { this.setTextStyles( evt ); } }
                            >
                                <FormatItalicIcon
                                    color={ `${ textStyles.italic ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className={ `${ textStyles.underline
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                name="underline"
                                onClick={ evt => { this.setTextStyles( evt ); } }
                            >
                                <FormatUnderlineIcon
                                    color={ `${ textStyles.underline ?
                                        "#f7f8f8" : "#226654" }` }
                                    size="18"
                                />
                            </button>
                            <button
                                className="items-alignment"
                                name="textColor"
                                onClick={ () => {
                                    this.setState( { textColorToggle: !textColorToggle } );
                                } }
                            >
                                { textColorToggle
                              &&
                              <div className="color-picker-wrapper">
                                  <BlockPicker
                                      color={ color }
                                      onChangeComplete={ this.handleTextColorChange }
                                      width="108px"
                                      className="text-color-picker"
                                  />
                              </div>
                                }
                                <FormatColorFillIcon color="#226654" size="18" />
                            </button>
                            <button
                                className="items-alignment selection-dropdown-btn"
                                onClick={ () => {
                                    this
                                        .setState( {
                                            visibleFontSelection: !visibleFontSelection,
                                            visibleFontSizeSelection: false,
                                        } );
                                } }
                            >Change font
                                <div
                                    style={ { display: `${ fontDropdownDisplay }` } }
                                    className="selection-dropdown-content"
                                >
                                    {availableFonts
                                        .map( font => (
                                            <span
                                                key={ font }
                                                style={ { display: `${ fontDropdownDisplay }` } }
                                                onClick={ ( evt ) => { this.selectFont( evt, font ); } }
                                            >{font}
                                            </span> ) )}
                                </div>
                            </button>

                            <h4 className="edit-section-subtitle space">items alignment</h4>
                            <div className="align-items">
                                <button
                                    className={ `${ styles[ "justify-content" ] === "flex-start"
                                        ? "items-alignment active-format" : "items-alignment" }` }
                                    onClick={ () => { this.setItemsAlignment( "flex-start" ); } }
                                >left
                                </button>
                                <button
                                    className={ `${ styles[ "justify-content" ] === "center"
                                        ? "items-alignment active-format" : "items-alignment" }` }
                                    onClick={ () => { this.setItemsAlignment( "center" ); } }
                                >center
                                </button>
                                <button
                                    className={ `${ styles[ "justify-content" ] === "flex-end"
                                        ? "items-alignment active-format" : "items-alignment" }` }
                                    onClick={ () => { this.setItemsAlignment( "flex-end" ); } }
                                >right
                                </button>
                                <button
                                    className={ `${ styles[ "justify-content" ] === "space-between"
                                        ? "items-alignment active-format" : "items-alignment" }` }
                                    onClick={ () => { this.setItemsAlignment( "space-between" ); } }
                                >space between
                                </button>
                                <button
                                    className={ `${ styles[ "justify-content" ] === "space-around"
                                        ? "items-alignment active-format" : "items-alignment" }` }
                                    onClick={ () => { this.setItemsAlignment( "space-around" ); } }
                                >space around
                                </button>

                            </div>
                        </div>

                        <h4 className="edit-section-subtitle space">items direction</h4>
                        <div className="align-items">
                            <button
                                className={ `${ styles[ "flex-direction" ] === "column"
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                style={ { width: "49%" } }
                                onClick={ () => { this.setFlexDirection( "column" ); } }
                            >vertical
                            </button>
                            <button
                                className={ `${ styles[ "flex-direction" ] === "row"
                                    ? "items-alignment active-format" : "items-alignment" }` }
                                style={ { width: "49%" } }
                                onClick={ () => { this.setFlexDirection( "row" ); } }
                            >horizontal
                            </button>
                        </div>
                        {
                            data.tag === "img" &&
                            <div className="image-change">
                                <h4 className="edit-section-subtitle">change image</h4>
                                <p className="edit-info">you can either upload one or give us a link</p>
                                <input
                                    type="text"
                                    name="imageLink"
                                    className="link-input"
                                    value={ imageSource }
                                    onChange={ ( evt ) => { this.onImageChange( evt ); } }
                                />
                                <input
                                    id="file"
                                    name="uploadedImage"
                                    className="file-upload upload-input"
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    multiple={ false }
                                    onChange={ ( evt ) => { this.onImageChange( evt ); } }
                                />
                                <label
                                    htmlFor="file"
                                    className="upload-button edit-upload"
                                >Upload image
                                </label>
                            </div>
                        }

                    </div>
                    <div className={ partiallyHidden ? "edited-component-panel full-width" :
                        "edited-component-panel" }
                    >
                        { data.tag &&
                            this.renderStyledComponent()
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ElementEditPanel.propTypes = {
    toggleHandler: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object,
    saveEditHandler: PropTypes.func.isRequired,
    addFontToDefaults: PropTypes.func.isRequired,
};

ElementEditPanel.defaultProps = {
    data: {},
};
export default ElementEditPanel;
