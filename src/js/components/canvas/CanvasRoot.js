import React from "react";
// import PropTypes from "prop-types";

import { BaseElement } from "../TemplateComponent";

const CanvasRoot = ( {
    className, dragOverHandler, dropHandler,
    clickHandler, mouseMoveHandler, mouseUpHandler, rootData, children,
} ) => {
    const { tag, styles } = rootData;
    const StyledElement = BaseElement.withComponent( tag || "div" );

    return (
        <StyledElement
            styles={ styles }
            onDragOver={ dragOverHandler }
            onDrop={ dropHandler }
            onClick={ clickHandler }
            onMouseMove={ mouseMoveHandler }
            onMouseUp={ mouseUpHandler }
            id={ `e${ rootData._id }` }
        >
            {children}
        </StyledElement>
    );
};

export default CanvasRoot;
