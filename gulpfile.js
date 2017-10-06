let gulp = require('gulp');

// Gulp Plugins
let sass = require('gulp-sass');
let uglify = require('gulp-uglify');
let cleanCSS = require('gulp-clean-css');
let sourceMaps = require('gulp-sourcemaps');
let imagemin = require('gulp-imagemin');

// Convert and minify sass files
gulp.task('sass', function () {
  return gulp
    .src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourceMaps.init())
    .pipe(cleanCSS())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./dist/css'));
});

// Minify JS files
gulp.task('uglify', function () {
  gulp
    .src('./src/js/*.js')
    .pipe(
      uglify().on('error', function (err) {
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(gulp.dest('./dist/js'));
});

// Minify Images
gulp.task('imgmin', function () {
  gulp
    .src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
});

// Build materialize-css library
gulp.task('materialize-css', function () {
  gulp
    .src('./libs/materialize-src/sass/materialize.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'));
});

// Watch files for changes
gulp.task('watch', function () {
  gulp.watch('./src/js/*.js', ['uglify']);
  gulp.watch('./src/sass/*.scss', ['sass']);
  gulp.watch('./src/img/*.*', ['imgmin']);
  gulp.watch('./libs/materialize-src/*.*', ['materialize-css']);
});

// Default Task that runs all other tasks
gulp.task('default', ['sass', 'uglify', 'imgmin', 'materialize-css', 'watch']);
