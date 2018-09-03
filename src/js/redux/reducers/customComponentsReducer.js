import * as types from "../actions/actionTypes";

export default function customComponentsReducer( state = [], action ) {
    switch ( action.type ) {
        case types.LOAD_DEFAULTS_SUCCESS: {
            return action.components;
        }
        default:
            return state;
    }
}
