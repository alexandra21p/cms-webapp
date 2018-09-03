import * as types from "../actions/actionTypes";

// const rigidTypes = ['header', 'footer', 'main'];

export default function canvasReducer( state = {}, action ) {
    switch ( action.type ) {
        case types.SELECT_ITEM: {
            return Object.assign( {}, state, {
                selectedItem: action.itemData,
            } );
        }
        case types.CLEAR_SELECTED_ITEM: {
            return Object.assign( {}, state, {
                selectedItem: null,
            } );
        }
        default:
            return state;
    }
}
