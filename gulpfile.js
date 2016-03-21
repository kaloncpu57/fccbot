'use strict';

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

/**
 * Start server using supervisor.
 * Wait 3 seconds for server start
 * then, launch browserSync.
 */
gulp.task('browser-sync', () => {
  supervisor('src/app.js', {
    ignore: ['src/dashboard']
  });

  setTimeout(() => {
    browserSync.init({
      proxy: 'localhost:3000',
      port: 7000
    });
  }, 3000);
});

/**
 * Watch for file changes and reload browser accordingly.
 * Watches (*.js|*.sass)
 */
gulp.task('watch', () => {
  gulp.watch('src/dashboard/views/**/*.ejs').on('change', browserSync.reload);

  gulp.watch([
    'src/dashboard/static/css/**/*.sass'
  ], ['sass']);

  gulp.watch([
    'src/dashboard/static/js/*.js'
  ], ['js']).on('change', browserSync.reload);
});

/**
 * Generates master vendor.min.css
 * Add further vendor CSS libraries to the below array
 * then, run `gulp css:vendor`.
 */
gulp.task('css:vendor', () => {
  return gulp.src([
    'node_modules/materialize-css/dist/css/materialize.min.css'
  ]).pipe(cssnano())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('src/dashboard/static'));
});


/**
 * Generates master vendor.min.js
 * Add further vendor JS libraries to the below array
 * then, run `gulp js:vendor`.
 */
gulp.task('js:vendor', () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/materialize-css/dist/js/materialize.min.js'
  ]).pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('src/dashboard/static'));
});

/**
 * Compiles SASS/SCSS, Autoprefixes, Minifys,
 * and concat into `main.min.css`.
 * This command run on file changes then reloads browser.
 */
gulp.task('sass', () => {
  return gulp.src([
    'src/dashboard/static/sass/**/*.sass'
  ]).pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    })).pipe(cssnano())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('src/dashboard/static'))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * Compiles ES2015 using Babel, minifies,
 * and concat into `main.min.js`.
 * This command runs on file changes then reloads browser.
 */
gulp.task('js', () => {
  return gulp.src([
    'src/dashboard/static/js/*.js'
  ]).pipe(babel({
      presets: ['es2015', 'stage-0']
    })).pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('src/dashboard/static'));
});
