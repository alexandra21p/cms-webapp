/* eslint 'jsx-a11y/no-static-element-interactions': 0,
'jsx-a11y/click-events-have-key-events': 0, 'no-nested-ternary': 0 */
import React from "react";
import PropTypes from "prop-types";

import { BaseElement } from "./TemplateComponent";

const renderChildren = ( children ) => children.map( ( {
    tag, attributes, childElements, styles, text,
}, index ) => {
    const StyledElement = BaseElement.withComponent( tag );
    const additionalProps = attributes ? { ...attributes, styles } : { styles };
    return (
        tag === "img" ? <StyledElement { ...additionalProps } key={ index } /> :
            (
                <StyledElement { ...additionalProps } key={ index }>
                    {childElements && renderChildren( childElements )}
                    {text && text}
                </StyledElement>
            )
    );
} );

class DefaultComponent extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            hovering: false,
        };

        this.StyledElement = BaseElement.withComponent( this.props.data.tag );
    }

    render() {
        const {
            data, dragStartHandler, dragEndHandler,
        } = this.props;

        const { hovering } = this.state;

        const {
            text, childElements, styles, attributes, tag,
        } = data;
        const stylesOnHover = hovering ? {
            ...styles,
            "background-color": "#f5f6f7",
        } : styles;

        const additionalProps = attributes ?
            { ...attributes, styles: stylesOnHover, draggable: true }
            : { styles: stylesOnHover, draggable: true };

        return (
            tag === "img" ?
                <this.StyledElement
                    onDragStart={ ( evt ) => { dragStartHandler( evt, data ); } }
                    onDragEnd={ () => { dragEndHandler(); } }
                    id={ `c${ data._id }` }
                    { ...additionalProps }
                /> :

                (
                    <this.StyledElement
                        onDragStart={ ( evt ) => { dragStartHandler( evt, data ); } }
                        onDragEnd={ () => { dragEndHandler(); } }
                        id={ `c${ data._id }` }
                        { ...additionalProps }
                    >
                        {childElements.length > 0 && this.renderChildren( childElements )}
                        {text && text}
                    </this.StyledElement>
                )
        );
    }
}

DefaultComponent.propTypes = {
    data: PropTypes.object.isRequired,
    dragStartHandler: PropTypes.func.isRequired,
    dragEndHandler: PropTypes.func.isRequired,
};

export default DefaultComponent;
