'use strict';
const { dest,src,watch, parallel, series } = require('gulp');
const scss                                 = require('gulp-sass');
const concat                               = require('gulp-concat');
const browserSync                          = require('browser-sync').create();
const uglify                               = require('gulp-uglify-es').default;
const autoPrefixer                         = require('gulp-autoprefixer');
const imageMin                             = require('gulp-imagemin');
const del                                  = require('del')
const cssmin                               = require('gulp-cssmin');

let paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'src/css'
  },
  scripts: {
    src: 'src/js/main.js',
    dest: 'src/js/'
  },
  markup: {
    src:"src/*.html"
  }
};
function scripts() {
  return src([
     paths.scripts.src
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest(paths.scripts.dest))
  .pipe(browserSync.stream())
}

function jsLibs() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(dest(paths.scripts.dest))
  .pipe(browserSync.stream())
}
function browsersync(){
  browserSync.init({
    server: {
        baseDir: "src/."
    }
  });
}
function sass() {
  return src(paths.styles.src)
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoPrefixer({
			overrideBrowserslist: ['last 10 version'],
      grid: true
		  }))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
};

function style() {
  return src(['node_modules/normalize.css/normalize.css',
            'node_modules/slick-carousel/slick/slick.css'])
    .pipe(concat('libs.min.css'))
    .pipe(cssmin())
    .pipe(dest(paths.styles.dest))
}

function images() {
  return src(['src/images/**/*'])
  .pipe(imageMin([
    imageMin.gifsicle({interlaced: true}),
    imageMin.mozjpeg({quality: 75, progressive: true}),
    imageMin.optipng({optimizationLevel: 5}),
    imageMin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
]))
  .pipe(dest('dist/images'))
  
}

function watching() {
  watch([paths.styles.src],sass)
  watch([paths.scripts.src],scripts)
  watch(paths.markup.src).on('change', browserSync.reload)
};

function delDist() {
  return del('dist')
}

function build() {
  return src([
    'src/*.html',
    'src/css/style.min.css',
    'src/css/libs.min.css',
    'src/fonts/**/*',
    'src/js/main.min.js',
    'src/js/libs.min.js'
  ],{base: 'src'})
  .pipe(dest('dist'))
}

exports.jsLibs = jsLibs;
exports.style = style;
exports.sass = sass;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.default = parallel(browsersync,watching);
exports.build = series(delDist,images,style,build);
exports.images = images;
exports.delDist = delDist;