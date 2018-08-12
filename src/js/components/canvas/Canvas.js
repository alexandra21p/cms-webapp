/* eslint 'jsx-a11y/no-static-element-interactions': 0, 'jsx-a11y/click-events-have-key-events': 0,
 'complexity': 0
*/
import React from "react";
import PropTypes from "prop-types";

import CanvasItem from "./CanvasItem";

import "../../../css/settings.scss";
import "../../../css/designer.scss";

class Canvas extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedCanvasItem: null,
            selectedCanvasItemCoords: null,
        };

        this.onMouseUp = this.onMouseUp.bind( this );
        this.onCanvasItemSelection = this.onCanvasItemSelection.bind( this );

        this.canvasProperties = null;
        this.canMove = false;
        this.offsetLeft = 0;
        this.offsetTop = 0;
        this.scrollOffset = 0;
    }

    componentDidMount() {
        const parentCoords = this.canvas.getClientRects()[ "0" ];
        this.canvasProperties = {
            x: parentCoords.x,
            y: parentCoords.y,
            width: parseInt( parentCoords.width, 10 ),
            height: parseInt( parentCoords.height, 10 ),
        };
        document.querySelector( ".designer-page" )
            .addEventListener(
                "scroll",
                ( evt ) => { this.scrollOffset = evt.srcElement.scrollTop; },
            );
    }

    onDragOver( evt ) { // eslint-disable-line
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move"; /* eslint no-param-reassign: 'off' */
    }

    onDrop( evt ) {
        const { x, y } = this.canvasProperties;
        const initialCoords = {
            left: evt.clientX - x,
            top: evt.clientY - y,
        };
        this.props.handleElementDrop( evt, initialCoords );
    }

    onCanvasItemSelection( {
        id, x, y, width, height, eventType, mousePosition,
    } ) {
        if ( eventType === "click" ) {
            this.setState( { selectedCanvasItem: id } );
            this.canMove = false;
            return;
        }
        this.canMove = true;
        const {
            width: parentWidth, height: parentHeight,
        } = this.canvasProperties;
        const updatedLeftOffset = Math.min( Math.max( mousePosition.clientX - x, 0 ), parentWidth );
        const updatedTopOffset = Math.min( Math.max( mousePosition.clientY - y, 0 ), parentHeight );

        this.offsetLeft = updatedLeftOffset;
        this.offsetTop = this.scrollOffset > 0
            ? updatedTopOffset - ( this.scrollOffset * 2 ) : updatedTopOffset;

        this.setState( {
            selectedCanvasItem: id,
            selectedCanvasItemCoords: {
                width, height,
            },
        } );
    }

    onMouseMove( evt ) {
        if ( !this.canMove ) {
            return;
        }
        const {
            width: parentWidth, height: parentHeight, x, y,
        } = this.canvasProperties;
        const { clientX, clientY } = evt;

        const { width, height } = this.state.selectedCanvasItemCoords;
        const rightLimit = parentWidth - width;
        const bottomLimit = parentHeight - height;
        const xPosition = Math.max( clientX, x );
        const yPosition = Math.max( clientY, y );

        // need to update the top offset when scrolling
        this.offsetTop = this.scrollOffset > 0
            ? this.offsetTop + this.scrollOffset : this.offsetTop;

        const computedOffsetLeft = xPosition - x - this.offsetLeft;
        const computedOffsetTop = yPosition - y - this.offsetTop;

        this.setState( {
            selectedCanvasItemCoords: {
                left: Math.min( Math.max( computedOffsetLeft, 0 ), rightLimit ),
                top: Math.min( Math.max( computedOffsetTop, 0 ), bottomLimit ),
                width,
                height,
            },
        }, () => { this.offsetTop -= this.scrollOffset; } );
    }

    onMouseUp() {
        this.canMove = false;
        if ( this.state.selectedCanvasItemCoords ) {
            this.setState( { selectedCanvasItemCoords: null } );
        }
    }

    deselectCanvasElement( evt ) {
        if ( evt.target.className !== "canvas" ) {
            return;
        }
        this.setState( { selectedCanvasItem: null } );
    }

    render() {
        const { selectedCanvasItem } = this.state;
        const { elements, className } = this.props;

        return (
            <main className="canvas-container">
                <div
                    ref={ ( node ) => { this.canvas = node; } }
                    className={ className }
                    onDragOver={ ( e ) => { this.onDragOver( e ); } }
                    onDrop={ ( e ) => this.onDrop( e ) }
                    onClick={ ( e ) => { this.deselectCanvasElement( e ); } }
                    onMouseMove={ ( e ) => { this.onMouseMove( e ); } }
                    onMouseUp={ this.onMouseUp }
                >
                    {elements.map( elem => (
                        <CanvasItem
                            key={ elem.id }
                            itemSelectionHandler={ this.onCanvasItemSelection }
                            mouseOverHandler={ () => {} }
                            elementData={ elem }
                            selectedCanvasItem={ selectedCanvasItem }
                            coords={ selectedCanvasItem === elem.id
                                ? this.state.selectedCanvasItemCoords : null }
                            parentContainerProps={ this.canvasProperties }
                        />
                    ) )}
                </div>
            </main>
        );
    }
}

Canvas.propTypes = {
    elements: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    handleElementDrop: PropTypes.func.isRequired,
};

export default Canvas;
