/* eslint 'jsx-a11y/no-static-element-interactions': 0,
'jsx-a11y/click-events-have-key-events': 0, 'no-nested-ternary': 0 */
import React from "react";
import PropTypes from "prop-types";

class CanvasItem extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            hovering: false,
        };

        this.onMouseOver = this.onMouseOver.bind( this );
        this.onMouseOut = this.onMouseOut.bind( this );

        this.currentCoords = props.elementData.initialCoords;
    }

    componentDidMount() {
        const {
            parentContainerProps:
          { width: parentWidth, height: parentHeight }, elementData,
        } = this.props;

        const { width, height } = document.querySelector( `#${ elementData.id }` )
            .getClientRects()[ 0 ];

        // update the element coords when dropping it in the canvas:
        // evenly placed relative to the mouse pointer and inside the parent bounds
        const left = Math.min( Math.max( this.currentCoords.left
          - ( parseInt( width, 10 ) / 2 ), 0 ), parentWidth - width );
        const top = Math.min( Math.max( this.currentCoords.top
          - ( parseInt( height, 10 ) / 2 ), 0 ), parentHeight - height );

        this.currentCoords = { left, top };

        this.setState(this.state); // eslint-disable-line
    }

    onMouseOver() {
        this.setState( { hovering: true } );
        this.props.mouseOverHandler( this.props.elementData.id );
    }
    onMouseOut() {
        this.setState( { hovering: false } );
    }

    onItemSelection( evt ) {
        const { elementData, itemSelectionHandler } = this.props;
        const coords = evt.target.getClientRects()[ "0" ];
        const mousePosition = {
            clientX: evt.clientX,
            clientY: evt.clientY,
        };
        itemSelectionHandler( {
            id: elementData.id,
            x: coords.x,
            y: coords.y,
            mousePosition,
            width: coords.width,
            height: coords.height,
            eventType: evt.type,
        } );
    }

    render() {
        const {
            elementData, selectedCanvasItem, coords,
            parentContainerProps,
        } = this.props;

        // update the current coords
        this.currentCoords = coords || this.currentCoords;
        const { hovering } = this.state;
        const border = selectedCanvasItem === elementData.id
            ? "2px solid gold" : ( hovering ? "2px dashed white" : elementData.styles.border );
        const zIndex = selectedCanvasItem === elementData.id ? 999 : "auto";
        const computedStyles = {
            ...elementData.styles,
            zIndex,
            transform: `translate3d(${ this.currentCoords.left }px, ${ this.currentCoords.top }px, 0)`,
        };

        // const widthConstraints = parentContainerProps.width - this.currentCoords.left;
        // const heightConstraints = parentContainerProps.height - this.currentCoords.top;

        return (
            <div
                key={ elementData.id }
                onMouseOver={ this.onMouseOver }
                onFocus={ this.onMouseOver }
                onMouseOut={ this.onMouseOut }
                onBlur={ this.onMouseOut }
                onClick={ ( e ) => { this.onItemSelection( e ); } }
                onMouseDown={ ( e ) => { this.onItemSelection( e ); } }
                className="canvas-element"
                id={ elementData.id }
                style={ { ...computedStyles, border } }
            >
                {elementData.text}
            </div>
        );
    }
}

CanvasItem.propTypes = {
    mouseOverHandler: PropTypes.func.isRequired,
    itemSelectionHandler: PropTypes.func.isRequired,
    elementData: PropTypes.object.isRequired, // eslint-disable-line
    selectedCanvasItem: PropTypes.string,
    coords: PropTypes.object, // eslint-disable-line
    parentContainerProps: PropTypes.object,  // eslint-disable-line
};

CanvasItem.defaultProps = {
    coords: null,
    selectedCanvasItem: null,
};
export default CanvasItem;
