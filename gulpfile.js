// 'use strict';

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browsersync = require("browser-sync").create();
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");


// Sass Task...
function sassTask() {
    return src("app/scss/style.scss")
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(postcss([autoprefixer()]))
        .pipe(dest("dist/css"))
}

// Js Task
function jsTask() {
    return src("app/js/app.js", { sourcemaps: true })
        .pipe(terser())
        .pipe(dest("dist/js"), { sourcemaps: "." })
}


// Browser sync tasks...
function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: "."
        }
    });
    cb();
}

function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}


// watch task
function watchTask() {
    watch("*.html", browserSyncReload);
    watch(["app/scss/**/*.scss", "app/js/**/*.js"], 
    series(sassTask, jsTask, browserSyncReload));
}


exports.default = series(
    sassTask,
    jsTask,
    browserSyncServe,
    watchTask
)

