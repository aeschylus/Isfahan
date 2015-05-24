'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var paths = {
  lint: ['./gulpfile.js', './lib/**/*.js'],
  watch: ['./gulpfile.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('browserify', function() {
  return browserify('./lib/isfahan.js')
    .bundle()

    //Pass desired output filename to vinyl-source-stream
    .pipe(source('index.js'))

    // Start piping stream to tasks!
    .pipe(gulp.dest('./'))
    .pipe(gulp.dest('./examples/assets/js/'));
});

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('istanbul', function(cb) {
  gulp.src(paths.source)
    .pipe(plugins.istanbul()) // Covering files
  .pipe(plugins.istanbul.hookRequire()) // Force `require` to return covered files
  .on('finish', function() {
    gulp.src(paths.tests)
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.jasmine())
    .pipe(plugins.istanbul.writeReports()) // Creating the reports after tests runned
    .on('finish', function() {
      process.chdir(__dirname);
      cb();
    });
  });
});

gulp.task('bump', ['test'], function() {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json'])
    .pipe(plugins.bump({
      type: bumpType
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['test'], function() {
  gulp.watch(paths.watch, ['test', 'browserify']);
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('release', ['bump']);

gulp.task('default', ['browserify', 'test']);
