System.config({
    //use typescript for compilation
    transpiler: 'typescript',
    //typescript compiler options
    typescriptOptions: {
        emitDecoratorMetadata: true
    },
    //map tells the System loader where to look for things
    map: {
        app: "./src",
        lib: "./lib",
        '@angular': 'https://npmcdn.com/@angular',
        'rxjs': 'https://npmcdn.com/rxjs@5.0.0-beta.6',
        "lodash": "https://npmcdn.com/lodash"
    },
    //packages defines our app package
    packages: {
        app: {
            main: './main.ts',
            defaultExtension: 'ts'
        },
        lib: {
            defaultExtension: 'js'
        },
        '@angular/core': {
            main: 'bundles/core.umd.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'bundles/compiler.umd.js',
            defaultExtension: 'js'
        },
        '@angular/common': {
            main: 'bundles/common.umd.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic': {
            main: 'bundles/platform-browser-dynamic.umd.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'bundles/platform-browser.umd.js',
            defaultExtension: 'js'
        },
        '@angular/forms': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/http': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/router': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        rxjs: {
            defaultExtension: 'js'
        },
        lodash: {
            defaultExtension: 'js'
        }
    }
});
