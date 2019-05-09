const gulp = require("gulp");
const util = require("gulp-util");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");

const imageResize = require("gulp-image-resize");
const imagemin = require("gulp-imagemin");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const del = require("del");
const notify = require("gulp-notify");
const browserSync = require("browser-sync");

// Dev Server
gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: "dist"
    },
    notify: false,
    open: true
  });
});

// Scss
gulp.task("styles", () => {
  return (
    gulp
      .src("src/styles/**/*.scss")
      .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
      .pipe(rename({ suffix: ".min", prefix: "" }))
      .pipe(autoprefixer(["last 15 versions"]))
      // .pipe(cleanCss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.stream())
  );
});

gulp.task("build-styles", () => {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleanCss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest("dist/css"));
});

// JS
gulp.task("scripts", () => {
  return (
    gulp
      .src([
        "src/js/common.js" // Always at the end
      ])
      .pipe(concat("scripts.min.js"))
      // .pipe(uglify()) // Mifify js (opt.)
      .pipe(gulp.dest("dist/js"))
      .pipe(browserSync.reload({ stream: true }))
  );
});

gulp.task("build-scripts", () => {
  return gulp
    .src([
      "src/js/common.js" // Always at the end
    ])
    .pipe(concat("scripts.min.js"))
    .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest("dist/js"));
});

// HTML Live Reload
gulp.task("html", () => {
  return gulp.src("dist/*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task("build", gulp.parallel("build-styles", "build-scripts"));

gulp.task("watch", () => {
  gulp.watch("src/styles/**/*.scss", gulp.parallel("styles"));
  gulp.watch(["src/js/common.js"], gulp.parallel("scripts"));
  gulp.watch("dist/*.html", gulp.parallel("html"));
});
gulp.task(
  "default",
  gulp.parallel("styles", "scripts", "browser-sync", "watch")
);
