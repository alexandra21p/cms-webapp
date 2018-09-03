/* eslint 'jsx-a11y/no-static-element-interactions': 0,
*/
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BasicModal from "../components/BasicModal";
import Canvas from "../components/canvas/Canvas";
import ElementEditPanel from "../components/ElementEditPanel";
import CustomComponents from "../components/CustomComponents";
import * as userActions from "../redux/actions/userActions";
import * as messageActions from "../redux/actions/messageActions";
import * as templateActions from "../redux/actions/templateActions";
import * as canvasActions from "../redux/actions/canvasActions";
import * as customComponentActions from "../redux/actions/customComponentActions";
import { decryptAppTokens } from "../utils/helperMethods";

import "../../css/profile.scss";
import "../../css/settings.scss";
import "../../css/designer.scss";

const classesOutsideArea = [ "components-container", "content" ];

class Designer extends React.Component {
    constructor() {
        super();
        this.state = {
            visibleModal: true,
            visibleModalContainer: true,
            templateName: "",
            currentDragElement: null,
            isEditPanelVisible: false,
        };

        this.createTemplate = this.createTemplate.bind( this );
        this.handleBackClick = this.handleBackClick.bind( this );
        this.onDragStart = this.onDragStart.bind( this );
        this.onDragStop = this.onDragStop.bind( this );
        this.onDrop = this.onDrop.bind( this );
        this.handleCanvasItemSelection = this.handleCanvasItemSelection.bind( this );
        this.showElementEditPanel = this.showElementEditPanel.bind( this );
        this.deleteElementFromCanvas = this.deleteElementFromCanvas.bind( this );
        this.onEditPanelToggle = this.onEditPanelToggle.bind( this );
        this.showPagePreview = this.showPagePreview.bind( this );
        this.goToPublishPage = this.goToPublishPage.bind( this );
        this.saveComponentChanges = this.saveComponentChanges.bind( this );
        this.deselectFromCanvas = this.deselectFromCanvas.bind( this );
        this.saveFontChoice = this.saveFontChoice.bind( this );
    }

    componentDidMount() {
        const parentContainer = document.querySelector( ".content" );
        parentContainer.addEventListener( "click", this.deselectFromCanvas );
        this.props.clearSelectedItem();
        this.props.getCustomComponents();
    }

    componentWillUnmount() {
        document.querySelector( ".content" )
            .removeEventListener( "click", this.deselectFromCanvas );
    }

    onDragStart( evt, data ) {
        evt.dataTransfer.setData( "data", JSON.stringify( data ) );
        this.setState( {
            currentDragElement: data,
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

    onDrop( evt ) {
        const { _id: templateId } = this.props.template;
        const targetId = evt.target.id.slice( 1 );
        const data = JSON.parse( evt.dataTransfer.getData( "data" ) );
        const {
            text, childElements, attributes, styles, tag,
        } = data;

        if ( tag && styles ) {
            this.props.addComponent( templateId, targetId, {
                tag, styles, childElements, attributes, text,
            } );
        }
    }

    onEditPanelToggle() {
        this.setState( { isEditPanelVisible: false } );
    }

    handleBackClick() {
        this.props.hideMessage();
        this.props.history.replace( "/profile" );
    }

    handleCanvasItemSelection( item ) {
        if ( this.state.isEditPanelVisible ) {
            return;
        }
        this.props.selectItem( item );
    }

    showElementEditPanel( ) {
        this.setState( {
            isEditPanelVisible: true,
        } );
    }

    showPagePreview() {
        const { getTemplateData, template } = this.props;
        getTemplateData( template._id )
            .then( () => { this.props.history.replace( "/preview" ); } );
    }

    saveFontChoice( font ) {
        this.props.saveFontChoice( font );
    }

    deselectFromCanvas( evt ) {
        const { className } = evt.target;
        if ( !classesOutsideArea.includes( className ) ) {
            return;
        }
        this.props.clearSelectedItem();
    }

    goToPublishPage() {
        const { getTemplateData, template } = this.props;
        getTemplateData( template._id )
            .then( () => { this.props.history.replace( "/publish" ); } );
    }

    deleteElementFromCanvas( data ) {
        this.props.deleteComponent( data._id, data.relatedTemplate );
    }

    createTemplate( name ) {
        this.setState( { visibleModal: false } );
        setTimeout( () => this.setState( { visibleModalContainer: false } ), 400 );
        const userData = decryptAppTokens();
        this.props.initializeTemplate( userData, { name } );
    }

    saveComponentChanges( compId, templateId, changes ) {
        this.props.editComponent( compId, templateId, changes )
            .then( () => {
                this.setState( {
                    isEditPanelVisible: false,
                } );
            } );
    }

    render() {
        const { displayName, avatar } = this.props.user;
        const { templateName } = this.state;
        const {
            templateCreationModal, template, selectedItem, customComponents,
        } = this.props;

        const {
            visibleModal, visibleModalContainer, currentDragElement,
            isEditPanelVisible,
        } = this.state;
        const modalStyle = visibleModal ?
            "designer-welcome-box" : "designer-welcome-box slide-out";
        const modalContainerStyle = visibleModalContainer ?
            "modal-container flex" : "modal-container hidden-modal-container";

        return (
            <div className="designer-page">
                { templateCreationModal && <BasicModal
                    title={ displayName ? `Hey there, ${ displayName }!` : "Hey there!" }
                    subtitle="This is the designer page, where the magic happens."
                    closeHandler={ this.createTemplate }
                    modalContainerStyle={ modalContainerStyle }
                    modalContentStyle={ modalStyle }
                />
                }

                <header className="profile-header settings-header">
                    <button className="back-button" onClick={ this.handleBackClick }>
            Back to profile
                    </button>
                    <div className="template-name">
                        <input
                            name="siteName"
                            type="text"
                            className="modal-input"
                            onChange={ ( evt ) => {
                                this.setState( { templateName: evt.target.value } );
                            } }
                            value={ templateName || template.name }
                        />
                        <label htmlFor="siteName" className="name-label">your template name</label>
                    </div>
                    <div className="header-user-info">
                        <img
                            src={ avatar }
                            alt="avatar"
                            className="user-icon"
                            style={ { marginRight: "13px" } }
                        />
                        <button
                            className="simple-button"
                            onClick={ this.showPagePreview }
                        >Preview
                        </button>
                        <button
                            className="confirm-button"
                            onClick={ this.goToPublishPage }
                        >Publish
                        </button>
                    </div>
                </header>
                <div className="content">
                    <aside className="components-container">
                        <ElementEditPanel
                            toggleHandler={ this.onEditPanelToggle }
                            visible={ isEditPanelVisible }
                            data={ selectedItem || undefined }
                            saveEditHandler={ this.saveComponentChanges }
                            addFontToDefaults={ this.saveFontChoice }
                        />
                        <CustomComponents
                            components={ customComponents }
                            dragStartHandler={ this.onDragStart }
                            dragEndHandler={ this.onDragStop }
                        />
                    </aside>

                    <Canvas
                        className={ currentDragElement ? "canvas dragging" : "canvas" }
                        handleElementDrop={ this.onDrop }
                        handleElementEdit={ this.showElementEditPanel }
                        handleElementDelete={ this.deleteElementFromCanvas }
                        itemSelectionHandler={ this.handleCanvasItemSelection }
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
    template: PropTypes.object,
    initializeTemplate: PropTypes.func.isRequired,
    templateCreationModal: PropTypes.bool.isRequired,
    selectItem: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
    clearSelectedItem: PropTypes.func.isRequired,
    editComponent: PropTypes.func.isRequired,
    deleteComponent: PropTypes.func.isRequired,
    customComponents: PropTypes.array.isRequired,
    getCustomComponents: PropTypes.func.isRequired,
    addComponent: PropTypes.func.isRequired,
    saveFontChoice: PropTypes.func.isRequired,
    getTemplateData: PropTypes.func.isRequired,
};

Designer.defaultProps = {
    template: null,
    selectedItem: null,
};

const mapStateToProps = ( state ) => ( {
    user: state.user.userData,
    template: state.templates.currentTemplate,
    templateCreationModal: state.messages.templateCreationModal,
    selectedItem: state.canvas.selectedItem,
    customComponents: state.customComponents,
} );

const mapDispatchToProps = ( dispatch ) => ( {
    getUserProfile: userData => dispatch( userActions.getUserProfile( userData ) ),
    hideMessage: () => dispatch( messageActions.hideMessage() ),
    initializeTemplate: ( userData, templateData ) =>
        dispatch( templateActions.initializeTemplate( userData, templateData ) ),
    selectItem: ( itemData ) => dispatch( canvasActions.selectItem( itemData ) ),
    clearSelectedItem: () => dispatch( canvasActions.clearSelectedItem() ),
    editComponent: ( compId, templateId, changes ) => dispatch( canvasActions
        .editComponent( compId, templateId, changes ) ),
    deleteComponent: ( compId, templateId ) => dispatch( canvasActions
        .deleteComponent( compId, templateId ) ),
    getCustomComponents: () => dispatch( customComponentActions.getCustomComponents() ),
    addComponent: ( templateId, parentId, data ) => dispatch( canvasActions
        .addComponent( templateId, parentId, data ) ),
    saveFontChoice: ( font ) => dispatch( templateActions.saveFontChoice( font ) ),
    getTemplateData: ( templateId ) =>
        dispatch( templateActions.getTemplateData( templateId ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Designer );
