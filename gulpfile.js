var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var watchPath = require('gulp-watch-path');
var imagemin = require('gulp-imagemin');

gulp.task('default', ['watchsass', 'watchcss', 'watchjs', 'watchimage']);

gulp.task('sass', function () {
    return sass('./src/sass/**/*.scss', {
            style: 'expanded',
            noCache: true
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('watchsass', function () {
    gulp.watch('./src/sass/style.scss', ['sass']);
});

gulp.task('watchcss', function () {
    gulp.watch('./src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gulp.src(paths.srcPath)
            .pipe(minifycss())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(paths.distDir))
    });
});

gulp.task('watchjs', function () {
    gulp.watch('./src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(paths.distDir))
    });
});


gulp.task('watchimage', function () {
    gulp.watch('./src/image/**/*', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    });
});
