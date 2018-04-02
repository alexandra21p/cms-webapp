import fetch from "isomorphic-fetch";

const headers = {
    "Content-Type": "application/json",
};

function apiPost( url, data, extraHeaders = {} ) {
    const reqHeaders = Object.assign( {}, headers, extraHeaders );

    return fetch( url, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify( data ),
    } )
        .then( ( response ) => {
            if ( response.status === 200 ) {
                return response.json();
            } return ( response.status );
        } )
        .then( ( res ) => {
            if ( !res.success ) {
                throw new Error( res );
            }
            return res.payload;
        } );
}

function apiPut( url, data, extraHeaders = {} ) {
    const reqHeaders = Object.assign( {}, headers, extraHeaders );

    return fetch( url, {
        method: "PUT",
        headers: reqHeaders,
        body: JSON.stringify( data ),
    } )
        .then( ( response ) => {
            if ( response.status === 200 ) {
                return response.json();
            } return ( response.status );
        } )
        .then( ( res ) => {
            if ( !res.success ) {
                throw new Error( res );
            }
            return res.payload;
        } );
}

function apiGet( url, header = {} ) {
    const reqHeaders = Object.assign( {}, headers, header );

    return fetch( url, {
        method: "GET",
        headers: reqHeaders,
    } )
        .then( response => {
            if ( response.status === 200 ) {
                return response.json();
            }
            throw new Error( `${ response.status }: ${ response.statusText }` );
        } );
}

export {
    apiGet,
    apiPost,
    apiPut,
};
