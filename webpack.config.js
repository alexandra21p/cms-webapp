const dev = process.env.NODE_ENV !== "production";
const webpack = require( "webpack" );
const path = require( "path" );
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
const FriendlyErrorsWebpackPlugin = require( "friendly-errors-webpack-plugin" );

const plugins = [
    new webpack.optimize.CommonsChunkPlugin( {
        name: "lib",
        minChunks: Infinity,
        filename: "js/[name].bundle.js",
    } ),
    new FriendlyErrorsWebpackPlugin(),
    new ExtractTextPlugin( "css/styles.css" ),
];

if ( !dev ) {
    plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin( {
            "process.env.NODE_ENV": JSON.stringify( "production" ),
        } ),
        new webpack.optimize.UglifyJsPlugin( { mangle: false, sourceMap: true } ),
        new BundleAnalyzerPlugin( {
            analyzerMode: "static",
            reportFilename: "webpack-report.html",
            openAnalyzer: false,
        } ),
    );
}

module.exports = {
    context: path.join( __dirname, "src" ),
    devtool: dev ? "none" : "source-map",
    entry: {
        app: "./js/index.js",
        lib: [ "react", "react-dom" ],
    },
    resolve: {
        modules: [
            path.resolve( "./src" ),
            "node_modules",
        ],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract( {
                    fallback: "style-loader",
                    use: "css-loader?url=false",
                } ),
            },
        ],
    },
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "js/[name].bundle.js",
    },
    plugins,
    devServer: {
        hot: true,
        inline: true,
        proxy: {
            "/api": {
                target: "http://localhost:3030",
                pathRewrite: { "^/api": "" },
                historyApiFallback: true,
                changeOrigin: true,
            },
        },
    },

};
