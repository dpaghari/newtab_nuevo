'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
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
  gulp.watch('js/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'sass:watch', 'babel:watch']);
