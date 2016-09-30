var path = require("path");
var webpack = require("webpack");

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [
            {
                test: /\.tsx?$/, loader: 'ts-loader', exclude: [
                /node_modules/
            ]
            },
            {test: /\.json$/, loader: 'json'},
            {test: /\.html$/, loader: 'raw'}
            ,{
                test: /\.ts$/,
                loader: 'istanbul-instrumenter',
                enforce: "post"
            }
        ]
    },
    stats: {colors: true, reasons: true},
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                resolve: {},
                debug: false,
                ts: {
                    configFileName: "config/tsconfig.test.json"
                }
            }
        })
    ]
};
