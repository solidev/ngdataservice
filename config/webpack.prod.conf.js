var path = require("path");
var webpack = require("webpack");

module.exports = {
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.tsx?$/, loader: 'ts-loader', exclude: [
                /node_modules/
            ]
            },
            {test: /\.json$/, loader: 'json'},
            {test: /\.html$/, loader: 'raw'}
        ]
    },
    stats: {colors: true, reasons: true},
    debug: false,
    ts: {
        configFileName: "tsconfig.es5.json"
    },
    entry: {
        lib: "./src/ng2datastore.ts",
        vendors: "./src/vendors.ts"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    output: {
        path: './dist',
        filename: 'ng2datastore-bundle.js'
    },
};