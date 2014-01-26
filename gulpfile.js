var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('css', function () {
  gulp.src(['repository/**/*.css'])
      .pipe(csso())
      .pipe(concat('styles.css'))
      .pipe(gulp.dest('build/'));
});

gulp.task('js', function () {
  gulp.src([
        'js/anim-hash.js',
        'js/anim-hover.js',
        //'js/anim-vyrabene-dily.js',
        'js/banner.js'
      ])
      .pipe(concat('scripts.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/'));
});

gulp.task('clean', function () {
  gulp.src('build', { read: false }).pipe(clean());
});

gulp.task('default', ['clean'], function () {
  gulp.run('css', 'js');
});
