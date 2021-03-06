var gulp = require('gulp'),
  sass = require('gulp-sass'),
  neat = require('node-neat').includePaths,
  cleanCSS = require('gulp-clean-css');
  concat = require('gulp-concat');

var $ = require('gulp-load-plugins')();

var paths = {
  scss: 'app/assets/sass/**/*.scss'
}

// Transpile ES6 source files into JavaScript
gulp.task('build', function() {
  'use strict';

  return gulp.src(['src/**/*.js', 'src/**/*.es6'])
    .pipe($.cached('*.js'))
    .pipe($.babel())
    .pipe(gulp.dest('dist/'));
});

//compile css
gulp.task('sass', function() {
  return gulp.src(paths.scss)
    .pipe(sass({
      includePaths: ['assets/sass', 'node_modules/'].concat(neat)
    }).on('error', sass.logError))
    .pipe(gulp.dest('public/assets/css'));
});

// gulp.task('copy-assets', function() {  
//   gulp.src('./dist/assets/**/*')
//     .pipe(gulp.dest('public/assets/'));
// });

gulp.task('css:vendor', function() {
  //NOT node_modules/**/dist/*.css for now, manually import selected ones
  return gulp.src([
      'node_modules/angular-datepicker/dist/*.css',
      'node_modules/angularjs-datepicker/src/css/angular-datepicker.css'
    ])
    .pipe(concat('vendor.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch(paths.scss, ['sass']);
  gulp.watch('./app/assets/**/*', ['sass']);
});

// Run Hapi server and reload on changes
gulp.task('serve', ['sass:watch'], function() {
  'use strict';
  $.nodemon({
    script: 'src/server.js',
    ignore: ['gulpfile.js', 'node_modules', 'test'],
  });
});

// Run lab tests
gulp.task('test', function() {
  'use strict';
  return gulp.src(['test/**/*.js', 'test/mocks/*.js'])
    .pipe($.lab());
});

// Run tests and watch for changes to keep tests running
gulp.task('tdd', ['test'], function() {
  'use strict';
  gulp.watch('{src,test}/**/*.js', ['test']);
});

// Clean built directory
gulp.task('clean', function(callback) {
  'use strict';

  var del = require('del');
  del(['dist'], callback);
});

gulp.task('default', ['build']);
