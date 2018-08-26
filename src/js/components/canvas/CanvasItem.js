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
        this.canComputeSize = false;
        this.minimumDimensions = null;
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

        this.currentCoords = {
            left, top, width, height,
        };
        this.minimumDimensions = {
            width, height,
        };

        this.canComputeSize = true;
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
        const { elementData, itemSelectionHandler, itemResizeHandler } = this.props;
        const coords = evt.target.getClientRects()[ "0" ];
        const mousePosition = {
            clientX: evt.clientX,
            clientY: evt.clientY,
        };
        if ( evt.target.className.includes( "size-handle" ) ) {
            itemResizeHandler( {
                id: elementData.id,
                minimumDimensions: this.minimumDimensions,
                mousePosition,
                width: this.currentCoords.width,
                height: this.currentCoords.height,
                itemX: this.currentCoords.left,
                itemY: this.currentCoords.top,
                eventType: evt.type,
                resizeHandle: evt.target.className.split( " " )[ 1 ],
            } );
            return;
        }

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

    getDimensions() {
        const { parentContainerProps, coords } = this.props;
        this.currentCoords = coords || this.currentCoords;

        if ( !this.canComputeSize ) {
            return {
                widthWithinBoundaries: this.currentCoords.width,
                heightWithinBoundaries: this.currentCoords.height,
            };
        }

        const widthWithinBoundaries = Math.min(
            Math
                .max(
                    parseInt( this.currentCoords.width, 10 ),
                    this.minimumDimensions.width,
                ),
            parentContainerProps.width,
        );
        const heightWithinBoundaries = Math.min(
            Math
                .max(
                    parseInt( this.currentCoords.height, 10 ),
                    this.minimumDimensions.height,
                ),
            parentContainerProps.height,
        );
        return {
            widthWithinBoundaries, heightWithinBoundaries,
        };
    }

    render() {
        const {
            elementData, selectedCanvasItem, coords,
            editElementHandler, deleteElementHandler,
        } = this.props;

        // update the current coords
        this.currentCoords = coords || this.currentCoords;

        const { widthWithinBoundaries, heightWithinBoundaries } = this.getDimensions();
        const { hovering } = this.state;
        const border = selectedCanvasItem === elementData.id
            ? "2px solid #fb9a88" : ( hovering ? "2px dashed white" : elementData.styles.border );
        const zIndex = selectedCanvasItem === elementData.id ? 101 : "auto";
        const computedStyles = {
            ...elementData.styles,
            width: widthWithinBoundaries,
            height: heightWithinBoundaries,
            zIndex,
            transform: `translate3d(${
                this.currentCoords.left }px, ${ this.currentCoords.top }px, 0)`,
        };
        const resizeHandlesVisibility = hovering || selectedCanvasItem === elementData.id
            ? "visible" : "hidden";
        const actionButtonsVisibility = selectedCanvasItem === elementData.id
            ? "flex" : "none";

        return (
            <div
                className="canvas-element-wrapper"
                id={ elementData.id }
                style={ { ...computedStyles, border } }
            >
                <div
                    className="canvas-element"
                    onMouseOver={ this.onMouseOver }
                    onFocus={ this.onMouseOver }
                    onMouseOut={ this.onMouseOut }
                    onBlur={ this.onMouseOut }
                    onClick={ ( e ) => { this.onItemSelection( e ); } }
                    onMouseDown={ ( e ) => { this.onItemSelection( e ); } }
                >
                    {elementData.text}
                    <div
                        className="size-handle top-left"
                        style={ {
                            visibility: resizeHandlesVisibility,
                        } }
                    />
                    <div
                        className="size-handle top-right"
                        style={ {
                            visibility: resizeHandlesVisibility,
                        } }
                    />
                    <div
                        className="size-handle bottom-left"
                        style={ {
                            visibility: resizeHandlesVisibility,
                        } }
                    />
                    <div
                        className="size-handle bottom-right"
                        style={ {
                            visibility: resizeHandlesVisibility,
                        } }
                    />
                </div>

                <div
                    className="canvas-item-actions"
                    style={ { display: actionButtonsVisibility } }
                >
                    <button
                        className="action-button"
                        style={ { marginBottom: "10px" } }
                        onClick={ () => { editElementHandler( elementData ); } }
                    >edit
                    </button>
                    <button
                        className="action-button"
                        onClick={ () => { deleteElementHandler( elementData.id ); } }
                    >delete
                    </button>

                </div>
            </div>
        );
    }
}

CanvasItem.propTypes = {
    mouseOverHandler: PropTypes.func.isRequired,
    itemSelectionHandler: PropTypes.func.isRequired,
    itemResizeHandler: PropTypes.func.isRequired,
    editElementHandler: PropTypes.func.isRequired,
    deleteElementHandler: PropTypes.func.isRequired,
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
