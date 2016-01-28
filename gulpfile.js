const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tsConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
var webserver = require('gulp-webserver');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dest/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tsConfig.files)
    .pipe(sourcemaps.init())          // <--- sourcemaps
    .pipe(typescript(tsConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))      // <--- sourcemaps
    .pipe(gulp.dest('dest/app'));
});

gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/http.dev.js'
    ])
    .pipe(gulp.dest('dest/lib'))
});

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', './**/*.html', 'styles.css', '!app/**/*.ts', '!./node_modules/**/*'], { base : './' })
    .pipe(gulp.dest('dest'))
});

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);
gulp.task('default', ['build']);

gulp.task('server', function() {
  gulp.src('./dest/')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});