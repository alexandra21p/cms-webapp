const express = require( "express" );
const path = require( "path" );
const fs = require( "fs" );
const request = require( "request" );
const bodyParser = require( "body-parser" );

const app = express();
const port = 3000;

app.use( express.static( "dist" ) );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json( ) );

app.use( "/api", ( req, res ) => {
    const { url: reqUrl, method } = req;
    const url = `http://localhost:3030${ reqUrl }`;

    const requestOptions = {
        url,
        headers: {
        },
        method,
    };

    if ( method === "POST" ) {
        requestOptions.json = req.body;
        request.post( requestOptions ).pipe( res );
        return;
    }

    request( requestOptions ).pipe( res );
} );

app.get( "/*", ( req, res ) => {
    fs.readFile( path.resolve( __dirname, "dist", "index.html" ), "utf8", ( err, html ) => {
        res.send( html );
    } );
} );

app.listen( port, () => console.log( `app listening on port ${ port }...` ) );
