var path = require("path");
var webpack = require("webpack");
var ngtools = require("ngtools");

module.exports = {
    resolve: {
        extensions: ['.js', '.ts']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                enforce: 'post',
                test: /\.ts$/,
                loaders: ['@ngtools/webpack'],
                exclude: [/\.(spec|e2e)\.ts$/]
            }
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
        }),
        new ngtools.AotPlugin({
            tsConfigPath: 'tsconfig-aot.json',
            typeChecking: false
        }),
    ]

};
