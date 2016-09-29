var path = require("path");
var webpack = require("webpack");

module.exports = {
    resolve: {
        extensions: ['.js', '.ts']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [/node_modules/]
            },
            {test: /\.json$/, loader: 'json'},
            {test: /\.html$/, loader: 'raw'}
        ]
    },
    entry: {
         ng2datastore: "./src/ng2datastore.ts",
    //     vendors: "./src/vendors.ts"
    },
    output: {
        path: '../dist',
        library: 'ng2datastore',
        filename: "ng2datastore.umd.js",
        libraryTarget: "umd",
        umdNamedDefine: true

    },
    externals: [
        /angular/,
        /rxjs/,
        /lodash/
    ],
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                resolve: {},
                ts: {
                    configFileName: "config/tsconfig.bundle.json"
                }
            }
        })
    ]

};
