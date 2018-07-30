import * as types from "./actionTypes";
import * as messageActions from "./messageActions";
import { apiGet, apiPost, apiPut } from "../../utils/Api";
import { encryptToken, getError } from "../../utils/helperMethods";
import { errors } from "../../utils/errors";

export function loadLoggedUserSuccess( user ) {
    return { type: types.LOAD_LOGGED_USER_SUCCESS, user };
}

export function invalidateUser() {
    return { type: types.INVALIDATE_USER };
}

export function getUserProfile( userData ) {
    return dispatch => {
        const {
            id, provider, decryptedToken, decryptedSocialToken,
        } = userData;
        const headers = decryptedSocialToken ? {
            "x-access-token": decryptedToken,
            "access-token": decryptedSocialToken,
        } : { "x-access-token": decryptedToken };

        return apiGet(
            `/api/users/getProfile/${ provider }/${ id }`,
            headers,
        )
            .then( ( { payload } ) => {
                dispatch( loadLoggedUserSuccess( payload ) );
            } )
            .catch( () => {
                dispatch( invalidateUser() );
                dispatch( messageActions.showUserActionError() );
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
                dispatch( messageActions.showUserActionError( message ) );
                dispatch( invalidateUser() );
            } );
    };
}

export function registerUserLocal( {
    email, password, retypePassword, name, provider,
} ) {
    return dispatch => { // eslint-disable-line
        const differentPasswords = password !== retypePassword;
        if ( differentPasswords ) {
            const message = getError( "different_passwords", errors );
            dispatch( messageActions.showUserActionError( message ) );
        } else {
            return apiPost(
                "/api/users/registration",
                {
                    email, password, displayName: name, provider,
                },
            )
                .then( () => {
                    dispatch( messageActions.showUserActionSuccess() );
                    return Promise.resolve();
                } )
                .catch( ( error ) => {
                    const msg = getError( error.message, errors );
                    dispatch( messageActions.showUserActionError( msg ) );
                    dispatch( invalidateUser() );
                } );
        }
    };
}

export function loginUserSocial( { provider, accessToken } ) {
    return dispatch => apiPost(
        `/api/users/auth/${ provider }`,
        {
            access_token: accessToken,
            provider,
        },

    )
        .then( payload => {
            const { token, user } = payload;
            const { providers, socialAccessToken } = user;

            const { email, profileId: id } = providers.find( prov => prov.type === provider );
            const reversedId = id.split( "" ).reverse().join( "" );
            const encryptedToken = encryptToken( token, id, reversedId );

            localStorage.setItem( "auth", encryptedToken );
            localStorage.setItem(
                "userDetails",
                JSON.stringify( {
                    id, email, provider, socialAuthToken: socialAccessToken,
                } ),
            );

            dispatch( loadLoggedUserSuccess( user ) );
            return Promise.resolve();
        } )
        .catch( ( error ) => {
            const message = getError( error.message, errors );
            dispatch( messageActions.showUserActionError( message ) );
            dispatch( invalidateUser() );
        } );
}

export function logoutUser( {
    email, provider, decryptedToken, decryptedSocialToken,
} ) {
    let headers = { "x-access-token": decryptedToken };

    if ( decryptedSocialToken ) {
        headers = Object.assign( {}, headers, { access_token: decryptedSocialToken } );
    }

    return dispatch => apiPost(
        "/api/users/logout",
        { email, provider },
        headers,
    )
        .then( () => {
            dispatch( invalidateUser() );
            localStorage.removeItem( "auth" );
            localStorage.removeItem( "userDetails" );
        } )
        .catch( ( error ) => {
            console.log( error );
        } );
}

export function changeUserPassword( {
    currentPassword, newPassword, retypedPassword, userDetails,
} ) {
    return dispatch => {
        const differentPasswords = newPassword !== retypedPassword;

        if ( differentPasswords ) {
            const message = getError( "different_passwords", errors );
            dispatch( messageActions.showUserActionError( message ) );
        } else {
            const {
                email, provider, decryptedToken, decryptedSocialToken,
            } = userDetails;
            const headers = decryptedSocialToken ? {
                "x-access-token": decryptedToken,
                "access-token": decryptedSocialToken,
            } : { "x-access-token": decryptedToken };

            apiPut(
                "/api/users/editPassword",
                {
                    email, provider, password: currentPassword, newPassword,
                },
                headers,
            )
                .then( ( payload ) => {
                    dispatch( loadLoggedUserSuccess( payload ) );
                    dispatch( messageActions.showUserActionSuccess() );
                } )
                .catch( ( error ) => {
                    const msg = error.message === "401" ?
                        "Could not make changes. Check your password."
                        : getError( error.message, errors );
                    dispatch( messageActions.showUserActionError( msg ) );
                } );
        }
    };
}

export function updateUserProfile( {
    email, name, avatar, userDetails,
} ) {
    const {
        id, provider, decryptedToken, decryptedSocialToken,
    } = userDetails;

    const headers = decryptedSocialToken ? {
        "x-access-token": decryptedToken,
        "access-token": decryptedSocialToken,
    } : { "x-access-token": decryptedToken };

    return dispatch => apiPut(
        "/api/users/edit",
        {
            profileId: id, provider, email, displayName: name, avatar,
        },
        headers,
    )
        .then( ( payload ) => {
            dispatch( loadLoggedUserSuccess( payload ) );
            dispatch( messageActions.showUserActionSuccess() );
        } )
        .catch( ( error ) => {
            const msg = getError( error.message, errors );
            dispatch( messageActions.showUserActionError( msg ) );
        } );
}
