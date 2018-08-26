/* eslint 'jsx-a11y/no-static-element-interactions': 0, 'jsx-a11y/click-events-have-key-events': 0,
 'complexity': 0
*/
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BasicModal from "../components/BasicModal";
import Canvas from "../components/canvas/Canvas";
import ElementEditPanel from "../components/ElementEditPanel";
import * as userActions from "../redux/actions/userActions";
import * as messageActions from "../redux/actions/messageActions";

import "../../css/profile.scss";
import "../../css/settings.scss";
import "../../css/designer.scss";

class Designer extends React.Component {
    constructor() {
        super();
        this.state = {
            visibleModal: true,
            visibleModalContainer: true,
            canvasElements: [],
            currentDragElement: null,
            isEditPanelVisible: false,
            editableElement: null,
            availableComponents: [
                {
                    id: "firstElement",
                    text: "drag me bitchhh",
                    type: "header",
                    styles: {
                        backgroundColor: "#00ff0078",
                        border: "2px solid magenta",
                    },
                    width: "60%",
                    height: "50px",
                },
            ],
        };

        this.closeModal = this.closeModal.bind( this );
        this.handleBackClick = this.handleBackClick.bind( this );
        this.onDragStart = this.onDragStart.bind( this );
        this.onDragStop = this.onDragStop.bind( this );
        this.onDrop = this.onDrop.bind( this );
        this.showElementEditPanel = this.showElementEditPanel.bind( this );
        this.deleteElementFromCanvas = this.deleteElementFromCanvas.bind( this );
        this.onEditPanelToggle = this.onEditPanelToggle.bind( this );
    }

    onDragStart( evt, id ) {
        evt.dataTransfer.setData( "id", id );
        this.setState( {
            currentDragElement: id,
        } );
    }

    onDragOver( evt ) { // eslint-disable-line
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move"; /* eslint no-param-reassign: 'off' */
    }
    onDragStop( ) {
        this.setState( {
            currentDragElement: null,
        } );
    }
    onDrop( evt, initialCoords ) {
        const id = evt.dataTransfer.getData( "id" );
        const { availableComponents } = this.state;
        const newCanvasItem = availableComponents.find( comp => comp.id === id );
        if ( !newCanvasItem ) {
            return;
        }
        const idOnCanvas = `${ newCanvasItem.type }${ Date.now() }`;
        this.setState( {
            canvasElements: [
                ...this.state.canvasElements, {
                    ...newCanvasItem,
                    id: idOnCanvas,
                    initialCoords: {
                        ...initialCoords,
                        width: newCanvasItem.width,
                        height: newCanvasItem.height,
                    },
                } ],
        } );
    }

    handleBackClick() {
        this.props.hideMessage();
        this.props.history.replace( "/profile" );
    }

    showElementEditPanel( elementData ) {
        console.log( elementData, this );
        this.setState( {
            isEditPanelVisible: true,
            editableElement: elementData,
        } );
    }

    onEditPanelToggle( evt ) {
        const { value } = evt.target;
        this.setState( { isEditPanelVisible: false } );
    }
    deleteElementFromCanvas( id ) {
        const canvasObjects = this.state.canvasElements.slice();
        const itemIndex = canvasObjects.findIndex( item => item.id === id );
        if ( id !== -1 ) {
            canvasObjects.splice( itemIndex, 1 );
            this.setState( { canvasElements: canvasObjects } );
        }
    }

    closeModal() {
        this.setState( { visibleModal: false } );
        setTimeout( () => this.setState( { visibleModalContainer: false } ), 400 );
    }

    render() {
        const { displayName, avatar } = this.props.user;
        const {
            visibleModal, visibleModalContainer, availableComponents, currentDragElement,
            canvasElements, isEditPanelVisible, editableElement,
        } = this.state;
        const modalStyle = visibleModal ?
            "designer-welcome-box" : "designer-welcome-box slide-out";
        const modalContainerStyle = visibleModalContainer ?
            "modal-container flex" : "modal-container hidden-modal-container";

        return (
            <div className="designer-page">
                <BasicModal
                    title={ displayName ? `Hey there, ${ displayName }!` : "Hey there!" }
                    subtitle="This is the designer page, where the magic happens."
                    closeHandler={ this.closeModal }
                    modalContainerStyle={ modalContainerStyle }
                    modalContentStyle={ modalStyle }
                />

                <header className="profile-header settings-header">
                    <button className="back-button" onClick={ this.handleBackClick }>
            Back to profile
                    </button>
                    <div className="header-user-info">
                        <img
                            src={ avatar }
                            alt="avatar"
                            className="user-icon"
                            style={ { marginRight: "13px" } }
                        />
                        <button className="simple-button" onClick={ () => {} }>Preview</button>
                        <button className="confirm-button" onClick={ () => {} }>Publish</button>
                    </div>
                </header>
                <div className="content">
                    <aside className="components-container">
                        <ElementEditPanel
                            toggleHandler={ this.onEditPanelToggle }
                            visible={ isEditPanelVisible }
                            data={ editableElement || undefined }
                        />
                        <div
                            className={ currentDragElement
                                ? "component dragging" : "component" }
                            draggable
                            id={ availableComponents[ 0 ].id }
                            onDragStart={ ( e ) => { this.onDragStart( e, "firstElement" ); } }
                            onDragEnd={ this.onDragStop }
                            style={ {
                                backgroundColor: "pink",
                                border: "2px solid magenta",
                                borderRadius: "5px",
                                width: "60%",
                                height: "50px",
                            } }
                        >
                            {availableComponents[ 0 ].text}
                        </div>
                    </aside>

                    <Canvas
                        elements={ canvasElements }
                        className={ currentDragElement ? "canvas dragging" : "canvas" }
                        handleElementDrop={ this.onDrop }
                        handleElementEdit={ this.showElementEditPanel }
                        handleElementDelete={ this.deleteElementFromCanvas }
                    />
                </div>
            </div>
        );
    }
}

Designer.propTypes = {
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hideMessage: PropTypes.func.isRequired,
};

const mapStateToProps = ( state ) => ( {
    user: state.user.userData,
} );

const mapDispatchToProps = ( dispatch ) => ( {
    getUserProfile: userData => dispatch( userActions.getUserProfile( userData ) ),
    hideMessage: () => dispatch( messageActions.hideMessage() ),

} );

export default connect( mapStateToProps, mapDispatchToProps )( Designer );
