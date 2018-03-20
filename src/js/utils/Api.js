import fetch from "isomorphic-fetch";

const headers = {
    "Content-Type": "application/json",
};

function apiPost( url, data ) {
    return fetch( url, {
        method: "POST",
        headers,
        body: JSON.stringify( data ),
    } )
        .then( ( response ) => response.json( ) )
        .then( ( res ) => {
            if ( !res.success ) {
                throw new Error( res.message );
            }
            return res.payload;
        } );
}

function apiGet( url ) {
    return fetch( url, {
        method: "GET",
        headers,
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
};
