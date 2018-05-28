import * as types from "./actionTypes";
import { apiGet, apiPost } from "../../utils/Api";
import { encryptToken, getError } from "../../utils/helperMethods";
import { errors } from "../../utils/errors";

export function loadLoggedUserSuccess( user ) {
    return { type: types.LOAD_LOGGED_USER_SUCCESS, user };
}

export function loadLoggedUserFailure( message ) {
    return { type: types.LOAD_LOGGED_USER_FAILURE, message };
}

export function getUserProfile( userData ) {
    return dispatch => {
        const {
            id, provider, authToken, socialAuthToken,
        } = userData;

        const headers = socialAuthToken ? {
            "x-access-token": authToken,
            "access-token": socialAuthToken,
        } : { "x-access-token": authToken };

        return apiGet(
            `/api/users/getProfile/${ provider }/${ id }`,
            headers,
        )
            .then( ( payload ) => {
                dispatch( loadLoggedUserSuccess( payload ) );
            } )
            .catch( ( error ) => {
                console.log( error );
                dispatch( loadLoggedUserFailure() );
            } );
    };
}

export function loginUserLocal( loginData ) {
    return dispatch => {
        const { email, password, provider } = loginData;
        return apiPost(
            "/api/users/login",
            { email, password, provider },
        )
            .then( payload => {
                const { token, user } = payload;
                const { profileId: id } = user.providers.find( prov =>
                    prov.email === email && prov.type === provider );

                const reversedId = id.split( "" ).reverse().join( "" );
                const encryptedToken = encryptToken( token, id, reversedId );

                localStorage.setItem( "auth", encryptedToken );
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify( { id, email, provider: "local" } ),
                );

                dispatch( loadLoggedUserSuccess( user ) );
                return Promise.resolve();
            } )
            .catch( ( error ) => {
                const message = getError( error.message, errors );
                dispatch( loadLoggedUserSuccess( message ) );
            } );
    };
}
