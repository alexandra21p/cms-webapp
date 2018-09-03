import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const BaseElement = styled.div`
  ${ ( { styles } ) => Object.entries( styles ).reduce( ( acc, entry ) => {
        const [ key, value ] = entry;
        return `${ acc }${ key }: ${ value }; `;
    }, "" ) }
    `;

const renderChildren = ( children ) => children.map( ( {
    _id, styles, tag, attributes, text, childElements,
} ) => (
    <TemplateComponent
        key={ _id }
        styles={ styles }
        tag={ tag }
        attributes={ attributes }
        text={ text }
        childElements={ childElements }
    /> ) );

const TemplateComponent = ( {
    styles, tag, text, childElements, attributes,
} ) => {
    const StyledElement = BaseElement.withComponent( tag || "div" );
    const additionalProps = attributes ? { ...attributes, styles } : { styles };

    return (
        tag === "img" ? <StyledElement { ...additionalProps } /> :
            (
                <StyledElement { ...additionalProps }>
                    {childElements && renderChildren( childElements )}
                    {text && text}
                </StyledElement>
            )
    );
};

TemplateComponent.propTypes = {
    styles: PropTypes.object.isRequired,
    tag: PropTypes.string.isRequired,
    text: PropTypes.string,
    childElements: PropTypes.array,
    attributes: PropTypes.object,
};

TemplateComponent.defaultProps = {
    text: null,
    childElements: [],
    attributes: null,
};
export default TemplateComponent;
export { BaseElement };
