var gulp        = require('gulp');
var serve       = require('gulp-serve');
var domSrc      = require('gulp-dom-src');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var cheerio     = require('gulp-cheerio');
var htmlMin     = require('gulp-htmlmin');
var cleanCSS      = require('gulp-clean-css');
var autoprefixer= require('gulp-autoprefixer');

gulp.task('serve', serve('./'));

gulp.task('css', function () {

    domSrc({ file:'index.html', selector:'link', attribute:'href' })
        .pipe(concat('app.full.min.css'))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/'))

});

gulp.task('js', function () {

    domSrc({ file:'index.html', selector:'script', attribute:'src' })
        .pipe(concat('app.full.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));

});

gulp.task('html', function () {

    gulp.src('index.html')
        .pipe(cheerio(function ($) {

            $('link').remove();
            $('script').remove();

            $('head').append('<link rel="stylesheet" href="app.full.min.css">');
            $('body').append('<script src="app.full.min.js"></script>');

        }))
        //.pipe(htmlMin({ collapseWhitespace:true }))
        .pipe(gulp.dest('dist/'));

});

gulp.task('build', ['css', 'js', 'html']);