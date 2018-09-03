import * as types from "./actionTypes";
import * as messageActions from "./messageActions";
import { apiGet, apiPost, apiPut } from "../../utils/Api";

import { getDefaultTemplateStructure } from "../../utils/template-utils";

export function loadTemplatesSuccess( templates ) {
    return { type: types.LOAD_TEMPLATES_SUCCESS, templates };
}

export function getTemplateSuccess( template ) {
    return { type: types.GET_TEMPLATE_SUCCESS, template };
}

export function createTemplateSuccess( template ) {
    return { type: types.CREATE_TEMPLATE_SUCCESS, template };
}
export function removeTemplate( id ) {
    return { type: types.REMOVE_TEMPLATE, id };
}

export function saveFontChoice( font ) {
  return { type: types.SAVE_FONT_CHOICE, font}
}

export function initializeTemplate( userData, templateData ) {
    return dispatch => {
        const {
            id,
        } = userData;
        const { name } = templateData;
        const defaultTemplateStructure = getDefaultTemplateStructure();

        return apiPost(
            "/api/templates/add",
            { name, userId: id, rootData: defaultTemplateStructure },
        )
            .then( payload => {
                dispatch( createTemplateSuccess( payload ) );
                console.log( "success", payload );
            } )
            .catch( () => {
                console.log( "error while initializing template" );
            } );
    };
}

export function getTemplateData( templateId ) {
    return dispatch => apiGet( `/api/templates/${ templateId }` )
        .then( ( { payload } ) => {
            console.log( "payload on get template", payload );
            dispatch( getTemplateSuccess( payload ) );
            dispatch( messageActions.hideMessage() );
            return Promise.resolve();
        } )
        .catch( ( error ) => {
            console.log( "error while fetching template...", error );
        } );
}

export function getAllTemplatesByUser( userId ) {
    return dispatch => apiGet( `/api/templates/${ userId }/all` )
        .then( payload => {
            console.log( payload );
            dispatch( loadTemplatesSuccess( payload ) );
            // return Promise.resolve();
        } )
        .catch( ( error ) => {
            console.log( "error while fetching all templates for user...", error );
        } );
}

export function deleteTemplate( userData, templateId ) {
    return dispatch => {
        const {
            email, provider, decryptedToken, decryptedSocialToken,
        } = userData;
        const headers = decryptedSocialToken ? {
            "x-access-token": decryptedToken,
            "access-token": decryptedSocialToken,
        } : { "x-access-token": decryptedToken };
        return apiPut( `/api/templates/${ templateId }/delete`, { email, provider }, headers )
            .then( ( ) => {
                dispatch( removeTemplate( templateId ) );
                // dispatch( messageActions.showSuccessfulTemplateDeletion );
            } )
            .catch( ( error ) => {
                console.log( "error while deleting template...", error );
            } );
    };
}
