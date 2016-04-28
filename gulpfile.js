'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano');
    // livereload = require('gulp-livereload');

gulp.task('scripts', function () {
  // Future processing for scripts
});

gulp.task('styles', function () {
  gulp.src('stylesheets/*.sass')
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

gulp.task('default', ['styles', 'sass:watch']);
