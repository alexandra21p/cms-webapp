/* eslint 'jsx-a11y/no-static-element-interactions': 0, 'jsx-a11y/click-events-have-key-events': 0,
 'complexity': 0
*/
/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as canvasActions from "../../redux/actions/canvasActions";

import CanvasRoot from "./CanvasRoot";
import CanvasElement from "./CanvasElement";

import "../../../css/settings.scss";
import "../../../css/designer.scss";

class Canvas extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedCanvasItemCoords: null,
        };

        this.onMouseUp = this.onMouseUp.bind( this );
        this.onCanvasItemSelection = this.onCanvasItemSelection.bind( this );
        this.onCanvasItemResize = this.onCanvasItemResize.bind( this );
        this.resizeCanvasElement = this.resizeCanvasElement.bind( this );
        this.setCanvasCoords = this.setCanvasCoords.bind( this );

        this.canvasProperties = null;
        this.canMove = false;
        this.offsetLeft = 0;
        this.offsetTop = 0;
        this.scrollOffset = 0;
        this.resizing = false;
        this.resizeStartDimensions = null;
        this.resizeHandle = null;
    }

    componentDidMount() {
        this.props.clearSelectedItem();
        // const parentCoords = this.canvas.getClientRects()[ "0" ];
        // this.canvasProperties = {
        //     x: parentCoords.x,
        //     y: parentCoords.y,
        //     width: parseInt( parentCoords.width, 10 ),
        //     height: parseInt( parentCoords.height, 10 ),
        // };
        document.querySelector( ".designer-page" )
            .addEventListener(
                "scroll",
                ( evt ) => {
                    this.scrollOffset = evt.srcElement.scrollTop;
                },
            );
        window.addEventListener( "resize", this.setCanvasCoords );
    }

    componentWillUnmount() {
        window.removeEventListener( "resize", this.setCanvasCoords );
    }

    onDragOver( evt ) { // eslint-disable-line
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move"; /* eslint no-param-reassign: 'off' */
    }

    onDrop( evt, element ) {
        // const { x, y } = this.canvasProperties;
        // const initialCoords = {
        //     left: evt.clientX - x,
        //     top: evt.clientY - y,
        // };
        this.props.handleElementDrop( evt, element );
    }

    onCanvasItemSelection( item ) {
        const { itemSelectionHandler } = this.props;
        itemSelectionHandler( item );
    //     id, x, y, width, height, eventType, mousePosition,
    // } ) {
    //     if ( eventType === "click" ) {
    //         this.setState( { selectedCanvasItem: id } );
    //         this.canMove = false;
    //         this.resizing = false;
    //         return;
    //     }
    //     this.canMove = true;
    //     this.resizing = false;
    //
    //     const {
    //         width: parentWidth, height: parentHeight,
    //     } = this.canvasProperties;
    //     const updatedLeftOffset = Math.min( Math.max( mousePosition.clientX - x, 0 ), parentWidth );
    //     const updatedTopOffset = Math.min( Math.max( mousePosition.clientY - y, 0 ), parentHeight );
    //
    //     this.offsetLeft = updatedLeftOffset;
    //     this.offsetTop = updatedTopOffset;
    //
    //     this.setState( {
    //         selectedCanvasItem: id,
    //         selectedCanvasItemCoords: {
    //             width, height,
    //         },
    //     } );
    }

    onCanvasItemResize( {
        id, width, height, itemX, itemY,
        eventType, mousePosition, resizeHandle, minimumDimensions,
    } ) {
        if ( eventType === "click" ) {
            this.resizing = false;
            this.canMove = false;
            return;
        }

        this.resizing = true;
        this.canMove = false;

        const {
            width: parentWidth, height: parentHeight, x, y,
        } = this.canvasProperties;
        const updatedLeftOffset = Math.min( Math.max( mousePosition.clientX - x, 0 ), parentWidth );
        const updatedTopOffset = Math.min( Math.max( mousePosition.clientY - y, 0 ), parentHeight );

        this.offsetLeft = updatedLeftOffset;
        this.offsetTop = updatedTopOffset;
        this.resizeStartDimensions = {
            width,
            height,
            top: itemY,
            left: itemX,
            minimumDimensions,
        };

        this.resizeHandle = resizeHandle;

        this.setState( {
            selectedCanvasItemCoords: {
                width,
                height,
                left: itemX,
                top: itemY,
            },
        } );
    }

    onMouseMove( evt ) {
        if ( !this.canMove && !this.resizing ) {
            return;
        }

        const {
            width: parentWidth, height: parentHeight, x, y,
        } = this.canvasProperties;
        const { clientX, clientY } = evt;

        const {
            width, height,
        } = this.state.selectedCanvasItemCoords;
        const rightLimit = parentWidth - width;
        const bottomLimit = parentHeight - height;
        const xPosition = Math.max( clientX, x );
        const yPosition = Math.max( clientY, y );

        // need to update the top offset when scrolling
        this.offsetTop = this.scrollOffset > 0
            ? this.offsetTop - this.scrollOffset : this.offsetTop;

        if ( this.resizing ) {
            this.resizeCanvasElement( {
                clientX: xPosition, clientY: yPosition,
            }, rightLimit, bottomLimit );
            return;
        }

        const computedOffsetLeft = xPosition - x - this.offsetLeft;
        const computedOffsetTop = yPosition - y - this.offsetTop;

        this.setState( {
            selectedCanvasItemCoords: {
                left: Math.min( Math.max( computedOffsetLeft, 0 ), rightLimit ),
                top: Math.min( Math.max( computedOffsetTop, 0 ), bottomLimit ),
                width,
                height,
            },
        }, () => { this.offsetTop += this.scrollOffset; } );
    }

    onMouseUp() {
        this.canMove = false;
        this.resizing = false;
        this.resizeHandle = null;
        if ( this.state.selectedCanvasItemCoords ) {
            this.setState( { selectedCanvasItemCoords: null } );
        }
    }

    setCanvasCoords() {
        // const canvasCoords = this.canvas.getClientRects()[ "0" ];
        // this.canvasProperties = {
        //     x: canvasCoords.x,
        //     y: canvasCoords.y,
        //     width: parseInt( canvasCoords.width, 10 ),
        //     height: parseInt( canvasCoords.height, 10 ),
        // };
    }

    resizeCanvasElement( {
        clientX: xPosition, clientY: yPosition,
    }, rightLimit, bottomLimit ) {
        const {
            top: lastY, left: lastX,
        } = this.state.selectedCanvasItemCoords;
        const { x, y } = this.canvasProperties;
        const {
            left, top, width, height, minimumDimensions,
        } = this.resizeStartDimensions;

        const resizeHandleOffsetLeft = xPosition - x;
        const resizeHandleOffsetTop = yPosition - y;
        let computedWidth, // eslint-disable-line
            computedHeight,
            computedLeftOffset,
            computedTopOffset;

        switch ( this.resizeHandle ) {
            case "top-left": {
                computedWidth = width
                - ( resizeHandleOffsetLeft - this.offsetLeft );
                computedHeight = height
                - ( resizeHandleOffsetTop - this.offsetTop );
                computedTopOffset = computedHeight < minimumDimensions.height
                    ? lastY : top + ( resizeHandleOffsetTop - this.offsetTop );
                computedLeftOffset = computedWidth < minimumDimensions.width
                    ? lastX : left + ( resizeHandleOffsetLeft - this.offsetLeft );
                break;
            }
            case "top-right": {
                computedWidth = width
        + ( resizeHandleOffsetLeft - this.offsetLeft );
                computedHeight = height
        - ( resizeHandleOffsetTop - this.offsetTop );
                computedTopOffset = computedHeight < minimumDimensions.height
                    ? lastY : top + ( resizeHandleOffsetTop - this.offsetTop );
                computedLeftOffset = left;
                break;
            }
            case "bottom-left": {
                computedWidth = width
            - ( resizeHandleOffsetLeft - this.offsetLeft );
                computedHeight = ( height
            + resizeHandleOffsetTop ) - this.offsetTop;
                computedLeftOffset = computedWidth < minimumDimensions.width
                    ? lastX : left + ( resizeHandleOffsetLeft - this.offsetLeft );
                computedTopOffset = top;
                break;
            }
            case "bottom-right": {
                computedWidth = ( width
              + resizeHandleOffsetLeft ) - this.offsetLeft;
                computedHeight = ( height
              + resizeHandleOffsetTop ) - this.offsetTop;
                computedLeftOffset = left;
                computedTopOffset = top;
                break;
            }
            default: {
                return;
            }
        }

        this.setState( {
            selectedCanvasItemCoords: {
                left: Math.min( Math.max( computedLeftOffset, 0 ), rightLimit ),
                top: Math.min( Math.max( computedTopOffset, 0 ), bottomLimit ),
                width: computedWidth,
                height: computedHeight,
            },
        }, () => { this.offsetTop += this.scrollOffset; } );
    }

    render() {
        const {
            className, handleElementEdit, handleElementDelete, rootComponent, selectedItem,
        } = this.props;

        return (
            <main className="canvas-container">
                { rootComponent.childElements &&
                <CanvasRoot
                    className={ className }
                    dragOverHandler={ ( e ) => { this.onDragOver( e ); } }
                    dropHandler={ ( e ) => this.onDrop( e, rootComponent ) }
                    mouseMoveHandler={ ( e ) => { this.onMouseMove( e ); } }
                    mouseUpHandler={ this.onMouseUp }
                    rootData={ rootComponent }
                >
                    { rootComponent.childElements.map( elem => (
                        <CanvasElement
                            key={ elem._id }
                            data={ elem }
                            parent={ rootComponent }
                            selectedItem={ selectedItem }
                            itemSelectionHandler={ this.onCanvasItemSelection }
                            deleteElementHandler={ handleElementDelete }
                            editElementHandler={ handleElementEdit }
                            dragOverHandler={ ( e ) => { this.onDragOver( e ); } }
                            dropHandler={ ( e ) => this.onDrop( e, elem ) }
                        />
                    ) )}
                </CanvasRoot>
                }
            </main>
        );
    }
}

Canvas.propTypes = {
    className: PropTypes.string.isRequired,
    handleElementDrop: PropTypes.func.isRequired,
    handleElementEdit: PropTypes.func.isRequired,
    handleElementDelete: PropTypes.func.isRequired,
    rootComponent: PropTypes.object.isRequired,
    clearSelectedItem: PropTypes.func.isRequired,
    itemSelectionHandler: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
};

Canvas.defaultProps = {
    selectedItem: null,
};

const mapStateToProps = ( state ) => ( {
    rootComponent: state.templates.currentTemplate.rootComponent,
    selectedItem: state.canvas.selectedItem,
} );

const mapDispatchToProps = ( dispatch ) => ( {
    clearSelectedItem: () => dispatch( canvasActions.clearSelectedItem() ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Canvas );

// /* eslint 'jsx-a11y/no-static-element-interactions': 0, 'jsx-a11y/click-events-have-key-events': 0,
//  'complexity': 0
// */
// import React from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
//
// import CanvasItem from "./CanvasItem";
//
// import "../../../css/settings.scss";
// import "../../../css/designer.scss";
//
// class Canvas extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             selectedCanvasItem: null,
//             selectedCanvasItemCoords: null,
//         };
//
//         this.onMouseUp = this.onMouseUp.bind( this );
//         this.onCanvasItemSelection = this.onCanvasItemSelection.bind( this );
//         this.onCanvasItemResize = this.onCanvasItemResize.bind( this );
//         this.resizeCanvasElement = this.resizeCanvasElement.bind( this );
//         this.setCanvasCoords = this.setCanvasCoords.bind( this );
//
//         this.canvasProperties = null;
//         this.canMove = false;
//         this.offsetLeft = 0;
//         this.offsetTop = 0;
//         this.scrollOffset = 0;
//         this.resizing = false;
//         this.resizeStartDimensions = null;
//         this.resizeHandle = null;
//     }
//
//     componentDidMount() {
//         const parentCoords = this.canvas.getClientRects()[ "0" ];
//         this.canvasProperties = {
//             x: parentCoords.x,
//             y: parentCoords.y,
//             width: parseInt( parentCoords.width, 10 ),
//             height: parseInt( parentCoords.height, 10 ),
//         };
//         document.querySelector( ".designer-page" )
//             .addEventListener(
//                 "scroll",
//                 ( evt ) => {
//                     this.scrollOffset = evt.srcElement.scrollTop;
//                 },
//             );
//         window.addEventListener( "resize", this.setCanvasCoords );
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener( "resize", this.setCanvasCoords );
//     }
//
//     onDragOver( evt ) { // eslint-disable-line
//         evt.preventDefault();
//         evt.dataTransfer.dropEffect = "move"; /* eslint no-param-reassign: 'off' */
//     }
//
//     onDrop( evt ) {
//         const { x, y } = this.canvasProperties;
//         const initialCoords = {
//             left: evt.clientX - x,
//             top: evt.clientY - y,
//         };
//         this.props.handleElementDrop( evt, initialCoords );
//     }
//
//     onCanvasItemSelection( {
//         id, x, y, width, height, eventType, mousePosition,
//     } ) {
//         if ( eventType === "click" ) {
//             this.setState( { selectedCanvasItem: id } );
//             this.canMove = false;
//             this.resizing = false;
//             return;
//         }
//         this.canMove = true;
//         this.resizing = false;
//
//         const {
//             width: parentWidth, height: parentHeight,
//         } = this.canvasProperties;
//         const updatedLeftOffset = Math.min( Math.max( mousePosition.clientX - x, 0 ), parentWidth );
//         const updatedTopOffset = Math.min( Math.max( mousePosition.clientY - y, 0 ), parentHeight );
//
//         this.offsetLeft = updatedLeftOffset;
//         this.offsetTop = updatedTopOffset;
//
//         this.setState( {
//             selectedCanvasItem: id,
//             selectedCanvasItemCoords: {
//                 width, height,
//             },
//         } );
//     }
//
//     onCanvasItemResize( {
//         id, width, height, itemX, itemY,
//         eventType, mousePosition, resizeHandle, minimumDimensions,
//     } ) {
//         if ( eventType === "click" ) {
//             this.setState( { selectedCanvasItem: id } );
//             this.resizing = false;
//             this.canMove = false;
//             return;
//         }
//
//         this.resizing = true;
//         this.canMove = false;
//
//         const {
//             width: parentWidth, height: parentHeight, x, y,
//         } = this.canvasProperties;
//         const updatedLeftOffset = Math.min( Math.max( mousePosition.clientX - x, 0 ), parentWidth );
//         const updatedTopOffset = Math.min( Math.max( mousePosition.clientY - y, 0 ), parentHeight );
//
//         this.offsetLeft = updatedLeftOffset;
//         this.offsetTop = updatedTopOffset;
//         this.resizeStartDimensions = {
//             width,
//             height,
//             top: itemY,
//             left: itemX,
//             minimumDimensions,
//         };
//
//         this.resizeHandle = resizeHandle;
//
//         this.setState( {
//             selectedCanvasItem: id,
//             selectedCanvasItemCoords: {
//                 width,
//                 height,
//                 left: itemX,
//                 top: itemY,
//             },
//         } );
//     }
//
//     onMouseMove( evt ) {
//         if ( !this.canMove && !this.resizing ) {
//             return;
//         }
//
//         const {
//             width: parentWidth, height: parentHeight, x, y,
//         } = this.canvasProperties;
//         const { clientX, clientY } = evt;
//
//         const {
//             width, height,
//         } = this.state.selectedCanvasItemCoords;
//         const rightLimit = parentWidth - width;
//         const bottomLimit = parentHeight - height;
//         const xPosition = Math.max( clientX, x );
//         const yPosition = Math.max( clientY, y );
//
//         // need to update the top offset when scrolling
//         this.offsetTop = this.scrollOffset > 0
//             ? this.offsetTop - this.scrollOffset : this.offsetTop;
//
//         if ( this.resizing ) {
//             this.resizeCanvasElement( {
//                 clientX: xPosition, clientY: yPosition,
//             }, rightLimit, bottomLimit );
//             return;
//         }
//
//         const computedOffsetLeft = xPosition - x - this.offsetLeft;
//         const computedOffsetTop = yPosition - y - this.offsetTop;
//
//         this.setState( {
//             selectedCanvasItemCoords: {
//                 left: Math.min( Math.max( computedOffsetLeft, 0 ), rightLimit ),
//                 top: Math.min( Math.max( computedOffsetTop, 0 ), bottomLimit ),
//                 width,
//                 height,
//             },
//         }, () => { this.offsetTop += this.scrollOffset; } );
//     }
//
//     onMouseUp() {
//         this.canMove = false;
//         this.resizing = false;
//         this.resizeHandle = null;
//         if ( this.state.selectedCanvasItemCoords ) {
//             this.setState( { selectedCanvasItemCoords: null } );
//         }
//     }
//
//     setCanvasCoords() {
//         const canvasCoords = this.canvas.getClientRects()[ "0" ];
//         this.canvasProperties = {
//             x: canvasCoords.x,
//             y: canvasCoords.y,
//             width: parseInt( canvasCoords.width, 10 ),
//             height: parseInt( canvasCoords.height, 10 ),
//         };
//     }
//
//     deselectCanvasElement( evt ) {
//         if ( evt.target.className !== "canvas" ) {
//             return;
//         }
//         this.setState( { selectedCanvasItem: null } );
//     }
//
//     resizeCanvasElement( {
//         clientX: xPosition, clientY: yPosition,
//     }, rightLimit, bottomLimit ) {
//         const {
//             top: lastY, left: lastX,
//         } = this.state.selectedCanvasItemCoords;
//         const { x, y } = this.canvasProperties;
//         const {
//             left, top, width, height, minimumDimensions,
//         } = this.resizeStartDimensions;
//
//         const resizeHandleOffsetLeft = xPosition - x;
//         const resizeHandleOffsetTop = yPosition - y;
//         let computedWidth, // eslint-disable-line
//             computedHeight,
//             computedLeftOffset,
//             computedTopOffset;
//
//         switch ( this.resizeHandle ) {
//             case "top-left": {
//                 computedWidth = width
//                 - ( resizeHandleOffsetLeft - this.offsetLeft );
//                 computedHeight = height
//                 - ( resizeHandleOffsetTop - this.offsetTop );
//                 computedTopOffset = computedHeight < minimumDimensions.height
//                     ? lastY : top + ( resizeHandleOffsetTop - this.offsetTop );
//                 computedLeftOffset = computedWidth < minimumDimensions.width
//                     ? lastX : left + ( resizeHandleOffsetLeft - this.offsetLeft );
//                 break;
//             }
//             case "top-right": {
//                 computedWidth = width
//         + ( resizeHandleOffsetLeft - this.offsetLeft );
//                 computedHeight = height
//         - ( resizeHandleOffsetTop - this.offsetTop );
//                 computedTopOffset = computedHeight < minimumDimensions.height
//                     ? lastY : top + ( resizeHandleOffsetTop - this.offsetTop );
//                 computedLeftOffset = left;
//                 break;
//             }
//             case "bottom-left": {
//                 computedWidth = width
//             - ( resizeHandleOffsetLeft - this.offsetLeft );
//                 computedHeight = ( height
//             + resizeHandleOffsetTop ) - this.offsetTop;
//                 computedLeftOffset = computedWidth < minimumDimensions.width
//                     ? lastX : left + ( resizeHandleOffsetLeft - this.offsetLeft );
//                 computedTopOffset = top;
//                 break;
//             }
//             case "bottom-right": {
//                 computedWidth = ( width
//               + resizeHandleOffsetLeft ) - this.offsetLeft;
//                 computedHeight = ( height
//               + resizeHandleOffsetTop ) - this.offsetTop;
//                 computedLeftOffset = left;
//                 computedTopOffset = top;
//                 break;
//             }
//             default: {
//                 return;
//             }
//         }
//
//         this.setState( {
//             selectedCanvasItemCoords: {
//                 left: Math.min( Math.max( computedLeftOffset, 0 ), rightLimit ),
//                 top: Math.min( Math.max( computedTopOffset, 0 ), bottomLimit ),
//                 width: computedWidth,
//                 height: computedHeight,
//             },
//         }, () => { this.offsetTop += this.scrollOffset; } );
//     }
//
//     render() {
//         const { selectedCanvasItem } = this.state;
//         const {
//             elements, className, handleElementEdit, handleElementDelete, templateComponents,
//         } = this.props;
//
//         return (
//             <main className="canvas-container">
//                 <div
//                     ref={ ( node ) => { this.canvas = node; } }
//                     className={ className }
//                     onDragOver={ ( e ) => { this.onDragOver( e ); } }
//                     onDrop={ ( e ) => this.onDrop( e ) }
//                     onClick={ ( e ) => { this.deselectCanvasElement( e ); } }
//                     onMouseMove={ ( e ) => { this.onMouseMove( e ); } }
//                     onMouseUp={ this.onMouseUp }
//                 >
//                     {templateComponents.map( elem => (
//                         <CanvasItem
//                             key={ elem.id }
//                             itemSelectionHandler={ this.onCanvasItemSelection }
//                             itemResizeHandler={ this.onCanvasItemResize }
//                             mouseOverHandler={ () => {} }
//                             elementData={ elem }
//                             selectedCanvasItem={ selectedCanvasItem }
//                             coords={ selectedCanvasItem === elem.id
//                                 ? this.state.selectedCanvasItemCoords : null }
//                             parentContainerProps={ this.canvasProperties }
//                             editElementHandler={ handleElementEdit }
//                             deleteElementHandler={ handleElementDelete }
//                         />
//                     ) )}
//                 </div>
//             </main>
//         );
//     }
// }
//
// Canvas.propTypes = {
//     elements: PropTypes.array.isRequired,
//     className: PropTypes.string.isRequired,
//     handleElementDrop: PropTypes.func.isRequired,
//     handleElementEdit: PropTypes.func.isRequired,
//     handleElementDelete: PropTypes.func.isRequired,
//     rootComponent: PropTypes.object.isRequired,
// };
//
// const mapStateToProps = ( state ) => ( {
//     rootComponent: state.templates.currentTemplate.rootComponent,
// } );
//
// const mapDispatchToProps = ( dispatch ) => ( {
//     // initializeTemplate: ( userData, templateData ) =>
//     //     dispatch( templateActions.initializeTemplate( userData, templateData ) ),
//
// } );
//
// export default connect( mapStateToProps, mapDispatchToProps )( Canvas );
