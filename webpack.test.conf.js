module.exports = {
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json'],
        modulesDirectories: ['node_modules','src']
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
        ]
    },
    stats: {colors: true, reasons: true},
    debug: false
}