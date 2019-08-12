let gulp = require('gulp')
let cleanCSS = require('gulp-clean-css')
let concat = require('gulp-concat')
let uglify = require('gulp-uglify')

gulp.task('minify-css', () => {
  return gulp.src('assets/src/css/*.css')
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('assets/css/'))
})

gulp.task('minify-js', () => {
  return gulp.src('assets/src/js/*.js')
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
})

gulp.task('default', gulp.parallel('minify-css', 'minify-js'))
