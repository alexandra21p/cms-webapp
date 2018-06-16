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
