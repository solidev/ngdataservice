module.exports = {
    resolve: {
        root: __dirname,
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
            { test: /\.ts$/,
                loader: 'istanbul-instrumenter'
            }
        ]
    },
    stats: {colors: true, reasons: true},
    debug: true,
    entry: "./src/index.ts"
}