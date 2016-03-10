var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
//var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');


var PATHS = {
    app: __dirname + '/public',
    bower: __dirname + '/public/bower_components'
};

gulp.task('clean', function () {
    return gulp.src(PATHS.app + "/dist", { read: false })
        .pipe(clean());
});

gulp.task('webpack', function () {
    return gulp.src(PATHS.app + "/index.js")
        .pipe(webpack({
            watch: true,
            resolve: {
                alias: {
                    ngmaterial: __dirname + "/node_modules/angular-material/angular-material.css",
                    ngloadingbar: __dirname + "/node_modules/angular-loading-bar/src/loading-bar.css",
                    maincss: __dirname + "/public/css/main.css"
                }
            },
            module: {
                loaders: [                    
                    { test: /\.css$/, loader: 'style!css' }               
                ]
            },            
            plugins: [
                new ngAnnotatePlugin({add: true}),
                //new webpack.webpack.optimize.UglifyJsPlugin({ minimize: true })
                
            ],
            //devtool: 'source-map',
            output: {
                filename: 'bundle.js',
            },
        }))
        //.pipe(rename('bundle.min.js'))
        .pipe(gulp.dest(PATHS.app + "/dist"));

});

gulp.task('default', ['clean', 'webpack']);
