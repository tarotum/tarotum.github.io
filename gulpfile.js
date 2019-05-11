const gulp = require("gulp");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const browserSync = require("browser-sync");
const sourcemaps = require("gulp-sourcemaps");

// Dev Server
gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: "app"
    },
    notify: false,
    open: true
  });
});

// Scss
gulp.task("styles", () => {
  return (
    gulp
      .src("app/styles/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
      .pipe(rename({ suffix: ".min", prefix: "" }))
      // .pipe(autoprefixer({ grid: true, browsers: ["last 2 versions"] }))
      // .pipe(cleanCss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("app/css"))
      .pipe(browserSync.stream())
  );
});

gulp.task("build-styles", () => {
  return gulp
    .src("app/styles/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer({ grid: true, browsers: ["last 2 versions"] }))
    .pipe(cleanCss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("app/css"));
});

// JS
gulp.task("scripts", () => {
  return (
    gulp
      .src([
        "app/scripts/common.js" // Always at the end
      ])
      .pipe(sourcemaps.init())
      .pipe(concat("scripts.min.js"))
      // .pipe(uglify()) // Mifify js (opt.)
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("app/js"))
      .pipe(browserSync.reload({ stream: true }))
  );
});

gulp.task("build-scripts", () => {
  return gulp
    .src([
      "app/scripts/common.js" // Always at the end
    ])
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.min.js"))
    .pipe(babel())
    .pipe(uglify()) // Mifify js (opt.)
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("app/js"));
});

// HTML Live Reload
gulp.task("html", () => {
  return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task("build", gulp.parallel("build-styles", "build-scripts"));

gulp.task("watch", () => {
  gulp.watch("app/styles/**/*.scss", gulp.parallel("styles"));
  gulp.watch(["app/scripts/common.js"], gulp.parallel("scripts"));
  gulp.watch("app/*.html", gulp.parallel("html"));
});
gulp.task(
  "default",
  gulp.parallel("styles", "scripts", "browser-sync", "watch")
);
