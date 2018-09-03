import * as types from "../actions/actionTypes";

export default function errorReducer( state = {}, action ) {
    switch ( action.type ) { /* eslint complexity: 'off' */
        case types.LOAD_LOGGED_USER_SUCCESS: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: false,
                templateCreationModal: false,
            } );
        }
        case types.SHOW_USER_ACTION_ERROR: {
            return Object.assign( {}, state, {
                error: {
                    status: true,
                    message: action.message === undefined ? "" : action.message,
                },
                templateCreationModal: false,
            } );
        }
        case types.HIDE_MESSAGE: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: false,
                templateCreationModal: false,
            } );
        }
        case types.SHOW_USER_ACTION_SUCCESS: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: true,
                templateCreationModal: false,
            } );
        }
        case types.SHOW_SUCCESSFUL_TEMPLATE_DELETION: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: true,
                templateCreationModal: false,
            } );
        }
        case types.SHOW_TEMPLATE_CREATION_MODAL: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: true,
                templateCreationModal: true,
            } );
        }
        default:
            return state;
    }
}
