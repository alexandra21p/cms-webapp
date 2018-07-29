import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BasicModal from "../components/BasicModal";
import * as userActions from "../redux/actions/userActions";
import * as messageActions from "../redux/actions/messageActions";

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
            availableComponents: [
                {
                    id: "firstElement",
                    text: "drag me bitchhh",
                },
            ],
        };

        this.closeModal = this.closeModal.bind( this );
        this.handleBackClick = this.handleBackClick.bind( this );
        this.onDragStart = this.onDragStart.bind( this );
        this.onDragStop = this.onDragStop.bind( this );
        this.onDrop = this.onDrop.bind( this );
    }

    onDragStart( evt, id ) {
        evt.dataTransfer.setData( "id", id );
        this.setState( {
            currentDragElement: id,
        } );
    }

    onDragOver( evt ) {
        console.log( this );
        evt.preventDefault();
    }
    onDragStop() {
        this.setState( {
            currentDragElement: null,
        } );
    }
    onDrop( evt ) {
        const id = evt.dataTransfer.getData( "id" );
        const { availableComponents } = this.state;
        const newCanvasItem = availableComponents.find( comp => comp.id === id );
        this.setState( {
            canvasElements: [ ...this.state.canvasElements, newCanvasItem ],
        } );
    }
    onMouseOver( id, evt ) {
        console.log( this, evt.target.getClientRects() );
    }

    closeModal() {
        this.setState( { visibleModal: false } );
        setTimeout( () => this.setState( { visibleModalContainer: false } ), 400 );
    }

    handleBackClick() {
        this.props.hideMessage();
        this.props.history.replace( "/profile" );
    }

    render() {
        const { displayName, avatar, providers } = this.props.user;
        const { email } = providers[ 0 ];
        const { visibleModal, visibleModalContainer, availableComponents } = this.state;
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
                        <img src={ avatar } alt="avatar" className="user-icon" />
                        <span>{ email }</span>
                    </div>
                </header>
                <div className="content">
                    <aside className="components-container">
                        <div
                            className={ this.state.currentDragElement
                                ? "component dragging" : "component" }
                            draggable
                            id={ availableComponents[ 0 ].id }
                            onDragStart={ ( e ) => { this.onDragStart( e, "firstElement" ); } }
                            onDragEnd={ this.onDragStop }
                            style={ {
                                backgroundColor: "pink", border: "2px solid magenta", borderRadius: "5px", width: "60%", height: "50px",
                            } }
                        >
                            {availableComponents[ 0 ].text}
                        </div>
                    </aside>
                    <main className="canvas-container">
                        <div
                            className="canvas"
                            onDragOver={ ( e ) => { this.onDragOver( e ); } }
                            onDrop={ this.onDrop }
                        >
                            {this.state.canvasElements.map( elem => (
                                <div
                                    key={ elem.id }
                                    onMouseOver={ ( e ) => { this.onMouseOver( elem.id, e ); } }
                                    onFocus={ ( e ) => { this.onMouseOver( elem.id, e ); } }
                                    className={ this.state.currentDragElement
                                        ? "component dragging" : "component" }
                                    id={ elem.id }
                                    style={ {
                                        backgroundColor: "green", border: "2px solid magenta", borderRadius: "5px", width: "60%", height: "50px",
                                    } }
                                >
                                    {elem.text}
                                </div> ) )}
                        </div>

                    </main>
                </div>
            </div>
        );
    }
}

Designer.propTypes = {
    // getUserProfile: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired, // eslint-disable-line
    history: PropTypes.object.isRequired, // eslint-disable-line
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
