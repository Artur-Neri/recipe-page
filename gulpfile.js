// initialize modules
const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browsersync = require('browser-sync').create();

// use dart-sass for @use
// sass.compiler = require('gulp-sass');

// sass task
function scssTask() {
  return src('app/scss/style.scss', {sourcemaps: true})
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(dest('dist', {sourcemaps: '.'}));
}

// browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// watch task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'],
    series(scssTask, browserSyncReload)
  );
}

// default gulp task
exports.default = series(scssTask, browserSyncServe, watchTask);