module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'es6-shim'],
        files: [
            'src/vendors.ts',
            {pattern: 'src/**/*.spec.ts', watched: false}
        ],
        exclude: [],
        preprocessors: {
            //      'dom-adapter-config.js': ['webpack'],
            'src/vendors.ts': ['webpack', 'sourcemap'],
            'src/**/*.spec.ts': ['webpack', 'sourcemap']
        },
        webpack: require("./webpack.test.conf.js"),
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {
                    type: 'json',
                    subdir: '.',
                    file: 'coverage.json'
                }
            ]
        },
        webpackServer: {
            noInfo: true //please don't spam the console when running in karma!
        },
        // possible values: 'dots', 'progress'
        reporters: ['mocha', 'coverage'],
        port: 9876,
        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};