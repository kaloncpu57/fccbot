const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync'),
  cssnano = require('gulp-cssnano'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  supervisor = require('gulp-supervisor'),
  uglify = require('gulp-uglify');

/**
 * Default task when running `gulp`.
 * Start local server with supervisor and proxy to browser-sync.
 * Create file watchers to reload on changes.
 */
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('browser-sync', () => {
  supervisor('src/app.js', {
    ignore: ['src/dashboard']
  });

  setTimeout(() => {
    browserSync.init({
      proxy: 'localhost:3000',
      port: 7000
    });
  }, 1000);
});

gulp.task('watch', () => {
  gulp.watch('src/dashboard/views/*.html').on('change', browserSync.reload);

  gulp.watch([
    'src/dashboard/static/css/*.css',
    'src/dashboard/static/css/*.scss',
    'src/dashboard/static/css/*.sass'
  ], ['sass']);

  gulp.watch([
    'src/dashboard/static/js/*.js'
  ], ['js']).on('change', browserSync.reload);
});

gulp.task('sass', () => {
  return gulp.src([
    'src/dashboard/static/css/*.css',
    'src/dashboard/static/css/*.scss',
    'src/dashboard/static/css/*.sass'
  ]).pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    })).pipe(cssnano())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('src/dashboard/static'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', () => {
  return gulp.src([
    'src/dashboard/static/js/*.js'
  ]).pipe(babel({
      presets: ['es2015', 'stage-0']
    })).pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('src/dashboard/static'));
});
