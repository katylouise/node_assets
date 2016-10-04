/**
 *	@fileoverview
 *	Runs the gulp build tasks
 */


 var gulp           = require('gulp'),

     // CSS modules
     sass           = require('gulp-sass'), // Gulp plugin for sass
     cssnano        = require('gulp-cssnano'), // Minify CSS with cssnano.
     autoprefixer   = require('gulp-autoprefixer'), // Prefix CSS
     mmq            = require('gulp-merge-media-queries'), // Combine matching media queries into one media query definition.

     // JS modules
     concat         = require('gulp-concat'), // Concatenates files
     jshint         = require('gulp-jshint'), // JSHint plugin for gulp
     uglify         = require('gulp-uglify'), // Minify files with UglifyJS

     // Utility modules
     plumber        = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp plugins
     rename         = require('gulp-rename'), // Rename files
     clean          = require('gulp-clean'), // A gulp plugin for removing files and folders
     sourcemaps     = require('gulp-sourcemaps'), // Source map support for Gulp
     browserSync    = require('browser-sync'), // Live CSS Reload & Browser Syncing
     reload         = browserSync.reload;


/*
 * Configuration
 */

var srcSCSS         = 'libs/stylesheet/**/*.scss',
    distCSS         = 'public/stylesheet/',
    cleanCSS        = 'public/stylesheet/**/*',
    srcJS           = 'libs/javascript/**/*.js',
    distJS          = 'public/javascript/',
    cleanJS         = 'public/javascript/**/*',
    projHTML        =  '**/*.html';


/*
 * Localhost, live reloading
 * Time-saving synchronised browser testing.
 */

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});


/*
 * CSS tasks
 * SCSS pre-processor used in project, compiles and minifies all *.scss to a single css files
 * A task to watch for changes and a task to clean the public css file(s)
 */

gulp.task('styles', function() {
    var AUTOPREFIXER_BROWSERS = [
        'last 2 version',
        '> 1%',
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4',
        'bb >= 10'
    ];
    gulp.src([ srcSCSS ])
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer( AUTOPREFIXER_BROWSERS ))
        .pipe(gulp.dest( distCSS ))
        .pipe(mmq({ log: true }))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( distCSS ))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch-styles', function() {
    gulp.watch(srcSCSS, ['styles'] );
});

gulp.task('clean-styles', function() {
    gulp.src([cleanCSS], {read: false} )
    .pipe(clean());
});


/*
 * JS tasks
 * Concatenates and minifies all JS files in source directory to a single .js file
 * A task to watch for changes and a task to clean the public js file(s)
 */

gulp.task('scripts', function() {
    gulp.src( srcJS )
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe( sourcemaps.init() )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( concat( 'scripts.js' ) )
        .pipe( gulp.dest( distJS ) )
        .pipe( uglify( {
            output: {
                'ascii_only': true
            }
        }))
        .pipe( rename({ suffix: '.min' }) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( gulp.dest( distJS ) )
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch-scripts', function() {
    gulp.watch(srcJS, ['scripts'] );
});

gulp.task('clean-scripts', function() {
    gulp.src([ cleanJS ], {read: false})
        .pipe(clean());
});


/*
 * Watching changes to the html file(s)
 * Starts browser-sync for browser testing
 */

gulp.task('watch-html', ['browser-sync'], function() {
    gulp.watch(projHTML, reload);
});


/*
 * CORE TASK
 *
 * To build once run `gulp`
 * To build and watch for changes run `gulp watch`
 * To clean the public directory run `gulp clean`
 */

gulp.task('clean', ['clean-styles', 'clean-scripts']);

gulp.task('watch', ['default', 'watch-styles', 'watch-scripts', 'watch-html', 'browser-sync']);

gulp.task('default', ['clean', 'styles', 'scripts']);
