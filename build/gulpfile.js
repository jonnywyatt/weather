// jshint node:true
'use strict';
const Gulp = require('gulp');
const Del = require('del');
const Sass = require('gulp-sass');

const paths = {
  sass: '../src/sass/**/*.scss'
};

Gulp.task('default', ['build']);

Gulp.task('build', ['build:sass']);

Gulp.task('clean', () => Del(['dist']));

Gulp.task('build:sass', () => {
  Gulp.src(paths.sass)
    .pipe(Sass({
      errLogToConsole: true
    }))
    .pipe(Gulp.dest('../public/css/'));
});

Gulp.task('watch', () => {
  Gulp.watch(
    [paths.sass],
    ['build:sass']
  );
});
