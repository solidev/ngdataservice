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
        "ng2datastore": "./node_modules/ng2datastore",
        '@angular': './node_modules/@angular',
        'rxjs': './node_modules/rxjs',
        "lodash": "./node_modules/lodash"
    },
    //packages defines our app package
    packages: {
        app: {
            main: './main.ts',
            defaultExtension: 'ts'
        },
        "ng2datastore": {
            main: "index.js",
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
            main: "index.js",
            defaultExtension: 'js'
        }
    }
});
