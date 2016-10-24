'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var uncss = require('gulp-uncss');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');

var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var watchify = require('watchify');

var b = watchify(browserify({
  entries: './js/newtab.js',
  debug: true
}));

b.on("update", bundle);
// b.on("log", gutil.log);

gulp.task("watchify", bundle);
gulp.task('scripts', function () {
  // set up the browserify instance on a task basis

  return b.bundle()
    .pipe(source('./newtab/newtab.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(plumber())
        .pipe(babel({
          presets: ["es2015"]
        }))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts:watch', function() {
  gulp.watch("newtab/*.js", ["scripts"]);
});

gulp.task('styles', function () {
  gulp.src('stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(uncss({ html : ["crx_wallpapersfmv1.0/newtab/blank.html"]}))
    .pipe(cssnano())
    .pipe(gulp.dest('newtab/'));
    // .pipe(livereload());
});

gulp.task('sass:watch', function () {
  // livereload.listen();
  gulp.watch('stylesheets/*.scss', ['styles']);
});

gulp.task('imagemin', function () {
  gulp.src('newtab/images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('newtab/images'));
});

gulp.task('default', ['styles', 'scripts', 'sass:watch', 'scripts:watch']);


// Functions

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('./js/newtab.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
       .pipe(babel({
         presets: ["es2015"]
       }))
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}
