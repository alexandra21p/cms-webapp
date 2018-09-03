import * as types from "./actionTypes";

export function hideMessage() {
    return { type: types.HIDE_MESSAGE };
}

export function showUserActionSuccess() {
    return { type: types.SHOW_USER_ACTION_SUCCESS };
}

export function showUserActionError( message ) {
    return { type: types.SHOW_USER_ACTION_ERROR, message };
}

export function showSuccessfulTemplateDeletion() {
    return { type: types.SHOW_SUCCESSFUL_TEMPLATE_DELETION };
}

export function showTemplateCreationModal() {
    return { type: types.SHOW_TEMPLATE_CREATION_MODAL };
}
