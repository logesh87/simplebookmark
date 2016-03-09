
'use strict';
var webpack = require('webpack'),
    path = require('path');

// PATHS
var PATHS = {
    app: __dirname + '/public',
    bower: __dirname + '/public/bower_components'
};

module.exports = {
    context: PATHS.app,
    entry: {
        app: ['webpack/hot/dev-server', './index.js']
    },
    output: {
        path: PATHS.app,
        filename: '/dist/bundle.js'
    },
    resolve: {
        alias: {
            ngmaterial: __dirname + "/node_modules/angular-material/angular-material.css",
            ngloadingbar: __dirname + "/node_modules/angular-loading-bar/src/loading-bar.css",
            maincss:__dirname +"/public/css/main.css"
        }
    },
    module: {
        loaders: [
            { test: /\.css?$/, loader: "style-loader!css-loader!" },
            {
                test: /\.js$/,
                loader: 'ng-annotate',
                exclude: /node_modules|bower_components/
            }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     minimize: true,
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};