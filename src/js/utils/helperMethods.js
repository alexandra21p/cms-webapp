const cryptLib = require( "cryptlib" );

const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NqEUNv2tWAn1Ty_tUyeowjBNGJVyOqu21mi_P0hQObF2SDmX";

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

const decryptAppTokens = () => {
    const {
        id, socialAuthToken, provider, email,
    } = JSON.parse( localStorage.getItem( "userDetails" ) );
    const token = localStorage.getItem( "auth" );

    const reversedId = id.split( "" ).reverse().join( "" );
    const decryptedToken = decryptToken( token, id, reversedId );
    const decryptedSocialToken = socialAuthToken ?
        decryptToken( socialAuthToken, id, reversedId ) : "";

    console.log( "THE TOKEN", token );
    return {
        id, provider, decryptedToken, decryptedSocialToken, email,
    };
};

export {
    capitalize,
    getError,
    encryptToken,
    decryptToken,
    checkProviderLoginStatus,
    defaultAvatar,
    decryptAppTokens,
};
