var path = require("path");
module.exports = {
    resolve: {
        root: path.resolve(__dirname, "../"),
        extensions: ['', '.ts', '.js', '.json']
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
        ],
        postLoaders: [
            {
                test: /\.ts$/,
                loader: 'istanbul-instrumenter'
            }
        ]
    },
    stats: {colors: true, reasons: true},
    debug: false,
    ts: {
        configFileName: "config/tsconfig.test.json"
    }
};