'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber');
    // livereload = require('gulp-livereload');

gulp.task('scripts', function () {
  // Future processing for scripts
  return gulp.src("js/*.js")
  .pipe(plumber())
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(gulp.dest("dist/js"));
});

gulp.task('styles', function () {
  gulp.src('stylesheets/*.sass')
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['./stylesheets', './node_modules/support-for/sass/']
    }).on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('newtab'));
    // .pipe(livereload());
});


gulp.task('sass:watch', function () {
  // livereload.listen();
  gulp.watch('stylesheets/*.sass', ['styles']);
});
gulp.task('babel:watch', function () {
  // livereload.listen();
  gulp.watch('js/*.js', ['javascript']);
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './js/newtab.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('./js/newtab.js'))
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
    .pipe(gulp.dest('./testbrowserify/'));
});




gulp.task('default', ['styles', 'scripts', 'sass:watch', 'babel:watch']);
