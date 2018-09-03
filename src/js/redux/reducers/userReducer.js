import * as types from "../actions/actionTypes";

export default function userReducer( state = {}, action ) {
    switch ( action.type ) {
        case types.LOAD_LOGGED_USER_SUCCESS: {
            return Object.assign( {}, state, {
                userData: action.user,
                isAuthenticated: true,
            } );
        }
        case types.INVALIDATE_USER: {
            return Object.assign( {}, state, { isAuthenticated: false, userData: {} } );
        }
        case types.LOG_USER_SUCCESS: {
            return Object.assign( {}, state, { isAuthenticated: true } );
        }
        default:
            return state;
    }
}
