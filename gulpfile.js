const {src, dest, series, parallel, watch} = require('gulp');

const origin = 'src';
const destination = 'build';
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

async function clean(cb) {
    await del(destination);
    cb();
}

function html(cb) {
  src(`${origin}/**/*.html`).pipe(dest(destination));
  cb();
}

function js(cb) {
    src(`${origin}/**/*.js`).pipe(dest(destination));
    cb();
}

function css(cb) {
  src(`${origin}/scss/style.scss`)
      .pipe(sass({
        outputStyle: 'compressed'
      }))

      .pipe(dest(`${destination}/style`));

    src(`${origin}/scss/reset.scss`)
        .pipe(sass({
            outputStyle: 'compressed'
        }))

        .pipe(dest(`${destination}/style`));

  cb();
}

function watcher(cb) {
    watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload))
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
    cb();
}

function server(cb) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: destination
        }
    })
    cb();
}

exports.default = series(clean, parallel(html, css, js), server, watcher);
