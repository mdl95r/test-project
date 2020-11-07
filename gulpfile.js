const project_folder = "dist";
const source_folder = "src";
const components = "components";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },

  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    pug: source_folder + "/*.pug",
    css: source_folder + "/scss/*.scss",
    js: [source_folder + "/js/*.{js,json,csv}", "!" + source_folder + "/" + components + "/_*.js"],
    img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,webp}",
    fonts: source_folder + "/fonts/*.{woff,woff2,ttf,svg}",
  },

  watch: {
    html: source_folder + "/**/*.html",
    pug: source_folder + "/**/*.pug",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.{js,json}",
    img: source_folder + "/img",
  },

  clean: "./" + project_folder + "/"
}

const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  fileinclude = require('gulp-include'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  imgmin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  del = require('del'),
  gulpPug = require('gulp-pug'),
  webphtml = require('gulp-webp-html'),
  groupMedia = require('gulp-group-css-media-queries'),
  browsersync = require("browser-sync").create(),
  gulpStylelint = require('gulp-stylelint'),
  cleanCss = require('gulp-clean-css'),
  renameCss = require('gulp-rename'),
  minify = require('gulp-minify');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },

    port: 3000,
    browser: 'chrome',
    notify: false
  })
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function pug() {
  return src(path.src.pug)
    .pipe(gulpPug({ pretty: true }))
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(minify({ noSource: true }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imgmin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )

    .pipe(dest(path.build.css))

    .pipe(cleanCss())

    .pipe(
      renameCss({
        extname: ".min.css"
      }))

    .pipe(dest(path.build.css))

    .pipe(browsersync.stream())
}

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream())
}

function lintCss() {
  return src(path.src.css)

    .pipe(gulpStylelint({
      reporters: [
        {
          formatter: 'string', console: true
        }
      ]
    }))
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.pug], pug);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.js], js);
}

function clean() {
  return del(path.clean)
}

const build = gulp.series(clean, gulp.parallel(js, css, html, pug, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.css = css;
exports.html = html;
exports.pug = pug;
exports.lintCss = lintCss;
exports.build = build;
exports.watch = watch;
exports.default = watch;