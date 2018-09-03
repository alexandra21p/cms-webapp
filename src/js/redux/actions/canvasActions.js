import * as types from "./actionTypes";
import * as templateActions from "./templateActions";
import { apiPut, apiDelete, apiPost } from "../../utils/Api";
import { getTemplateData } from "./templateActions";

export function selectItem( itemData ) {
    return { type: types.SELECT_ITEM, itemData };
}

export function clearSelectedItem( ) {
    return { type: types.CLEAR_SELECTED_ITEM };
}

export function addComponent( templateId, parentId, componentData ) {
  console.log(templateId, parentId, componentData);
    return dispatch => {
        return apiPost( `/api/components/add`, {
          templateId, parentId, componentData
        } )
            .then( ( { payload } ) => {
                dispatch( templateActions.getTemplateData( templateId ) );
				        return Promise.resolve();
            } )
            .catch( ( error ) => {
                console.log( "error while adding component...", error );
            } );
    };
}

export function editComponent( compId, templateId, newData ) {
    return dispatch => {
        return apiPut( `/api/components/${ compId }`, newData )
            .then( ( { payload } ) => {
                dispatch( templateActions.getTemplateData( templateId ) );
                dispatch( selectItem( payload ) );
				        return Promise.resolve();
            } )
            .catch( ( error ) => {
                console.log( "error while updating component...", error );
            } );
    };
}

export function deleteComponent( compId, templateId ) {
    return dispatch => {
        return apiDelete( `/api/components/${ compId }`, )
            .then( ( ) => {
                dispatch( templateActions.getTemplateData( templateId ) );
            } )
            .catch( ( error ) => {
                console.log( "error while updating component...", error );
            } );
    };
}
