var
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    source = require('vinyl-source-stream'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');


var PATHS = {
    app: __dirname + '/public',
    bower: __dirname + '/public/bower_components'
};

gulp.task('clean', function () {
    return gulp.src(PATHS.app + "/dist", { read: false })
        .pipe(clean());
});

gulp.task('css', function(){
    gulp.src(PATHS.app +'/css/*.css')
		.pipe(cssmin())
        .pipe(concat('main.min.css'))		
		.pipe(gulp.dest(PATHS.app + "/dist")); 
})

gulp.task('js', function() {
  return browserify(PATHS.app + "/index.js")
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.app + "/dist"));  
});

gulp.task('default', ['clean', 'css', 'js']);
