var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('build', function() {
  gulp.src('js/main.js')
  .pipe(browserify({
    insertGlobals : true,
    debug : !gulp.env.production
  }))
  .pipe(gulp.dest('./public'))
});

gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['build']);
});
