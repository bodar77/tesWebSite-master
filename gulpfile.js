var gulp = require('gulp'),
   	uglify = require('gulp-uglify'),
   	jshint = require('gulp-jshint'),
   	concat = require('gulp-concat');


gulp.task('minify', function () {
   gulp.src('js/slider.js')
      .pipe(uglify())
      .pipe(gulp.dest('build'))
});	

gulp.task('js', function () {
   return gulp.src(['js/*.js','!js/slider.js', '!js/modernizr.custom.18495.js', '!js/pf2.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('build'));
});

gulp.task('default', function () {
   gulp.watch('js/*.js', ['js']);
});