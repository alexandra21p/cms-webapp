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
            } );
        }
        case types.SHOW_USER_ACTION_ERROR: {
            return Object.assign( {}, state, {
                error: {
                    status: true,
                    message: action.message === undefined ? "" : action.message,
                },
            } );
        }
        case types.HIDE_MESSAGE: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: false,
            } );
        }
        case types.SHOW_USER_ACTION_SUCCESS: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: true,
            } );
        }
        default:
            return state;
    }
}
