const cryptLib = require( "cryptlib" );

const capitalize = ( input ) => input.slice( 0, 1 ).toUpperCase() + input.slice( 1 ).toLowerCase();

const getError = ( status, errorList ) => {
    const foundError = errorList.find( err => err.status === `${ status }` );
    const genericError = errorList.find( err => err.status === "default" );
    const message = foundError ? foundError.message : genericError.message;

    return message;
};

const encryptToken = ( token, key, initVector ) => {
    const hashedKey = cryptLib.getHashSha256( key, 32 ); // 32 bytes = 256 bits
    const encrypted = cryptLib.encrypt( token, hashedKey, initVector );

    return encrypted;
};

const decryptToken = ( encryptedText, key, initVector ) => {
    const hashedKey = cryptLib.getHashSha256( key, 32 ); // 32 bytes = 256 bits
    const decrypted = cryptLib.decrypt( encryptedText, hashedKey, initVector );

    return decrypted;
};

const checkProviderLoginStatus = ( provider ) => {
    if ( !window.FB ) {
        return false;
    }
    let isConnected;
    if ( provider === "facebook" ) {
        window.FB.getLoginStatus( ( { status } ) => {
            isConnected = status === "connected";
        } );
    }

    return isConnected;
};

export {
    capitalize,
    getError,
    encryptToken,
    decryptToken,
    checkProviderLoginStatus,
};
