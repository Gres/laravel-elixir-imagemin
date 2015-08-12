var Elixir = require('laravel-elixir');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var changed = require('gulp-changed');
var notify = require('gulp-notify');
var _ = require('underscore');
var config = Elixir.config;
var path = require('path');
/*
 |----------------------------------------------------------------
 | ImageMin Processor
 |----------------------------------------------------------------
 |
 | This task will trigger your images to be processed using
 | imagemin processor.
 |
 | Minify PNG, JPEG, GIF and SVG images
 |
 */
var gulpTask = function(src, output, options) {

    new Elixir.Task('imagemin', function() {
        var paths = prepGulpPaths(src, output);
        this.log(paths.src, paths.output);
        return gulp.src(paths.src.path)
            .pipe(changed(paths.output.path))
            .pipe(imagemin(options))
            .pipe(gulp.dest(paths.output.path))
            .on('error', notify.onError({
                title: 'ImageMin Failed!',
                message: 'Failed to optimise images.',
                icon: __dirname + '/../laravel-elixir/icons/fail.png'
            }));
    })
    .watch(config.get('assets.images.folder') + '/**/*.+(png|gif|svg|jpg|jpeg)');
};

Elixir.extend('imagemin', function() {
    gulpTask.apply(this, arguments);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|array} src
 * @param  {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function(src, output) {
    return new Elixir.GulpPaths()
        .src(src || config.get('assets.images.folder'))
        .output(output || config.get('public.images.outputFolder'));
};
