var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');

// Development mode?
var devBuild = (process.env.NODE_ENV !== 'production');

// Folders
var folder = {
  src: 'src/',
  build: 'dist/css',
};

// CSS Processing
gulp.task('css', function() {
  var postCssOpts = [
    autoprefixer({ browsers: ['last 2 versions', '>2%'] }),
    mqpacker,
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      precision: 3,
      errLogToConsole: true,
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build));
});
