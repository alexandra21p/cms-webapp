import * as types from "./actionTypes";
import * as messageActions from "./messageActions";
import { apiGet } from "../../utils/Api";

export function loadDefaultsSuccess( components ) {
    return { type: types.LOAD_DEFAULTS_SUCCESS, components };
}

export function getCustomComponents( ) {
    return dispatch => apiGet( `/api/defaults` )
        .then( ( { payload } ) => {
            console.log( payload );
            dispatch( loadDefaultsSuccess( payload ) );
            // return Promise.resolve();
        } )
        .catch( ( error ) => {
            console.log( "error while fetching all custom components...", error );
        } );
}
