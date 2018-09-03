/* eslint 'jsx-a11y/no-static-element-interactions': 0,
'jsx-a11y/click-events-have-key-events': 0, 'no-nested-ternary': 0 */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* eslint-disable */
const BaseElement = styled.div`
  ${ ( { styles } ) => Object.entries( styles ).reduce( ( acc, entry ) => {
        const [ key, value ] = entry;
        return `${ acc }${ key }: ${ value }; `;
    }, "" ) }
    `;

const rigidTypes = [ "header", "main", "footer" ];

class CanvasElement extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            // hovering: false,
        };

        this.onMouseOver = this.onMouseOver.bind( this );
        this.onMouseOut = this.onMouseOut.bind( this );
        this.renderChildren = this.renderChildren.bind( this );
        this.onItemSelection = this.onItemSelection.bind( this );

        this.canMove = !rigidTypes.includes( this.props.data.tag );

        this.currentCoords = props.data.initialCoords;
        this.canComputeSize = false;
        this.minimumDimensions = null;

        this.StyledElement = BaseElement.withComponent( this.props.data.tag );
    }

    componentDidMount() {
        // const {
        //     parentContainerProps:
        //   { width: parentWidth, height: parentHeight }, data,
        // } = this.props;
        //
        // const { width, height } = document.querySelector( `#${ data.id }` )
        //     .getClientRects()[ 0 ];
        //
        // // update the element coords when dropping it in the canvas:
        // // evenly placed relative to the mouse pointer and inside the parent bounds
        // const left = Math.min( Math.max( this.currentCoords.left
        //   - ( parseInt( width, 10 ) / 2 ), 0 ), parentWidth - width );
        // const top = Math.min( Math.max( this.currentCoords.top
        //   - ( parseInt( height, 10 ) / 2 ), 0 ), parentHeight - height );
        //
        // this.currentCoords = {
        //     left, top, width, height,
        // };
        // this.minimumDimensions = {
        //     width, height,
        // };
        //
        // this.canComputeSize = true;
        // this.setState(this.state); // eslint-disable-line
    }

    onMouseOver() {
        this.setState( { hovering: true } );
        // this.props.mouseOverHandler( this.props.data.id );
    }
    onMouseOut() {
        this.setState( { hovering: false } );
    }

    onItemSelection( evt ) {
        const { data, itemSelectionHandler } = this.props;
        const targetId = evt.target.id.slice( 1 );
        if ( data._id === targetId ) { itemSelectionHandler( data ); }
        // const { data, itemSelectionHandler, itemResizeHandler } = this.props;
        // const mousePosition = {
        //     clientX: evt.clientX,
        //     clientY: evt.clientY,
        // };
        // if ( evt.target.className.includes( "size-handle" ) ) {
        //     itemResizeHandler( {
        //         id: data.id,
        //         minimumDimensions: this.minimumDimensions,
        //         mousePosition,
        //         width: this.currentCoords.width,
        //         height: this.currentCoords.height,
        //         itemX: this.currentCoords.left,
        //         itemY: this.currentCoords.top,
        //         eventType: evt.type,
        //         resizeHandle: evt.target.className.split( " " )[ 1 ],
        //     } );
        //     return;
        // }
        //
        // const coords = evt.target.getClientRects()[ "0" ];
        // itemSelectionHandler( {
        //     id: data.id,
        //     x: coords.x,
        //     y: coords.y,
        //     mousePosition,
        //     width: this.currentCoords.width,
        //     height: this.currentCoords.height,
        //     eventType: evt.type,
        // } );
    }

    getDimensions() {
        // const { parentContainerProps } = this.props;
        //
        // if ( !this.canComputeSize ) {
        //     return {
        //         widthWithinBoundaries: this.currentCoords.width,
        //         heightWithinBoundaries: this.currentCoords.height,
        //     };
        // }
        //
        // const widthWithinBoundaries = Math.min(
        //     Math
        //         .max(
        //             parseInt( this.currentCoords.width, 10 ),
        //             this.minimumDimensions.width,
        //         ),
        //     parentContainerProps.width,
        // );
        // const heightWithinBoundaries = Math.min(
        //     Math
        //         .max(
        //             parseInt( this.currentCoords.height, 10 ),
        //             this.minimumDimensions.height,
        //         ),
        //     parentContainerProps.height,
        // );
        //
        // this.currentCoords = {
        //     ...this.currentCoords,
        //     width: widthWithinBoundaries,
        //     height: heightWithinBoundaries,
        // };
        //
        // return {
        //     widthWithinBoundaries, heightWithinBoundaries,
        // };
    }

    renderChildren( children ) {
        // const {
        //     itemSelectionHandler, itemResizeHandler,
        //     selectedCanvasItem, parentContainerProps, handleElementEdit, handleElementDelete,
        // } = this.props;
        return children.map( child => ( <CanvasElement
            key={ child._id }
            data={ child }
            parent={ this.props.data }
            selectedItem={ this.props.selectedItem }
            itemSelectionHandler={ this.props.itemSelectionHandler }
            deleteElementHandler={ this.props.deleteElementHandler }
            editElementHandler={ this.props.editElementHandler }
            dragOverHandler={ this.props.dragOverHandler }
            dropHandler={ this.props.dropHandler }
        /> ) );
    }

    render() {
        const {
            data, selectedItem,
            editElementHandler, deleteElementHandler,
            dragOverHandler, dropHandler,
        } = this.props;

        const { hovering } = this.state;

        // update the current coords
        // this.currentCoords = { ...this.currentCoords, ...coords } || this.currentCoords;
        // const { widthWithinBoundaries, heightWithinBoundaries } =
        // this.getDimensions( this.currentCoords );
        // const { hovering } = this.state;
        // const border = selectedCanvasItem === data.id
        //     ? "2px solid #fb9a88" : ( hovering ? "2px dashed white" : data.styles.border );
        // const zIndex = selectedCanvasItem === data.id ? 101 : "auto";
        // const computedStyles = {
        //     ...data.styles,
        //     width: widthWithinBoundaries,
        //     height: heightWithinBoundaries,
        //     zIndex,
        //     transform: `translate3d(${
        //         this.currentCoords.left }px, ${ this.currentCoords.top }px, 0)`,
        // };
        // const resizeHandlesVisibility = hovering || selectedCanvasItem === data.id
        //     ? "visible" : "hidden";
        const {
            text, childElements, styles, attributes, tag,
        } = data;
        const stylesOnHover = hovering ? {
            ...styles,
            outline: "2px dashed white",
            resize: "both",
            overflow: "auto",
        } : styles;
        const isSelected = selectedItem ? selectedItem._id === data._id : false;
        const actionButtonsVisibility = isSelected
            ? "flex" : "none";
        const updatedStyles = isSelected ? {
            ...styles,
            outline: "2px dashed #fb9a88",
            "outline-offset": "1px",
            position: "relative",
        } : stylesOnHover;
        const imageStyles = tag === "img"
            ? { ...updatedStyles, width: "100%", height: "100%" }
            : updatedStyles;
        const additionalProps = attributes ?
            { ...attributes, styles: imageStyles } : { styles: imageStyles };

        return (
            data.tag === "img" ?
                <div style={ {
                    width: data.styles.width,
                    height: data.styles.height,
                    position: "relative",
                } }
                >
                    <this.StyledElement
                        onClick={ this.onItemSelection }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        onResize
                        dragOverHandler={ dragOverHandler }
                        dropHandler={ dropHandler }
                        id={ `e${data._id}` }
                        { ...additionalProps }
                    />
                    <div
                        className="canvas-item-actions"
                        style={ { display: actionButtonsVisibility } }
                    >
                        <button
                            className="action-button"
                            style={ { marginBottom: "10px" } }
                            onClick={ () => { editElementHandler( data ); } }
                        >edit
                        </button>
                        <button
                            className="action-button"
                            onClick={ () => { deleteElementHandler( data ); } }
                        >delete
                        </button>

                    </div>
                </div>
                :
                <this.StyledElement
                    onClick={ this.onItemSelection }
                    onMouseOver={ this.onMouseOver }
                    onMouseOut={ this.onMouseOut }
                    onResize
                    dragOverHandler={ dragOverHandler }
                    dropHandler={ dropHandler }
                    id={ `e${data._id}` }
                    { ...additionalProps }
                >
                    {childElements.length > 0 && this.renderChildren( childElements )}
                    {text && text}

                    <div
                        className="canvas-item-actions"
                        style={ { display: actionButtonsVisibility } }
                    >
                        <button
                            className="action-button"
                            style={ { marginBottom: "10px" } }
                            onClick={ () => { editElementHandler( data ); } }
                        >edit
                        </button>
                        <button
                            className="action-button"
                            onClick={ () => { deleteElementHandler( data ); } }
                        >delete
                        </button>

                    </div>

                </this.StyledElement>
        // <div
        //     className="canvas-element-wrapper"
        //     id={ data.id }
        //     style={ { ...computedStyles, border } }
        // >
        //
        // <div
        //     className="size-handle top-left"
        //     style={ {
        //         visibility: resizeHandlesVisibility,
        //     } }
        // />
        // <div
        //     className="size-handle top-right"
        //     style={ {
        //         visibility: resizeHandlesVisibility,
        //     } }
        // />
        // <div
        //     className="size-handle bottom-left"
        //     style={ {
        //         visibility: resizeHandlesVisibility,
        //     } }
        // />
        // <div
        //     className="size-handle bottom-right"
        //     style={ {
        //         visibility: resizeHandlesVisibility,
        //     } }
        // />
        // </div>
        );
    }
}

CanvasElement.propTypes = {
    data: PropTypes.object.isRequired,
    itemSelectionHandler: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
    editElementHandler: PropTypes.func.isRequired,
    deleteElementHandler: PropTypes.func.isRequired,
    dragOverHandler: PropTypes.func.isRequired,
    dropHandler: PropTypes.func.isRequired,
};

CanvasElement.defaultProps = {
    // coords: null,
    // selectedCanvasItem: null,
    selectedItem: null,
};
export default CanvasElement;
