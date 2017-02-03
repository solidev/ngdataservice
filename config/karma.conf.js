

var customLaunchers = {
    sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '35'
    },
    sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '30'
    },
    sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
    }
}


module.exports = function (config) {
    var cfg = {
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            {pattern: './config/karma-test-shims.js', watched: false}
        ],

        preprocessors: {
            './config/karma-test-shims.js': ['webpack', 'sourcemap']
        },


        webpack: require("./webpack.test.js"),
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
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Firefox'],

        captureTimeout: 120000,
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 120000,
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true

    };
    if(process.env.SAUCE_ACCESS_KEY) {
        // Use saucelabs for CI tests
        cfg.reporters.push("saucelabs");
        cfg.sauceLabs = {
            testName: "ngDataStore unit tests",
            startConnect: true,
            build: process.env.CI_BUILD_ID || "manual"
        };
        cfg.customLaunchers = customLaunchers;
        cfg.browsers = Object.keys(customLaunchers);
    } else {
        // Use PhantomJS for local tests
        cfg.browsers = ["PhantomJS"]
    }

    config.set(cfg);

};
