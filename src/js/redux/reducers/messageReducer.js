import * as types from "../actions/actionTypes";

export default function errorReducer( state = {}, action ) {
    switch ( action.type ) {
        case types.LOAD_LOGGED_USER_SUCCESS: {
            return Object.assign( {}, state, {
                error: {
                    status: false,
                    message: "",
                },
                showSuccessMessage: false,
            } );
        }
        case types.LOAD_LOGGED_USER_FAILURE: {
            return Object.assign( {}, state, {
                error: {
                    status: true,
                    message: action.message,
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
        default:
            return state;
    }
}
