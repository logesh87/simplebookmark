
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
    module: {
        loaders: [
            // {
            //     test: /\.css$/,
            //     loader: 'style-loader!css-loader'
            // }, 
            {
                test: /\.js$/,
                loader: 'ng-annotate',
                exclude: /node_modules|bower_components/
            }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};