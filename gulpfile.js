// gulp and gulp plugins
const gulp = require('gulp');
const gulpif = require('gulp-if');
const clean_css = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const envify = require('gulp-envify');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');

// vinyl
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// browserify
const browserify = require('browserify');
const watchify = require('watchify');
const hmr = require('browserify-hmr');
const babelify = require('babelify');
const envifyify = require('envify/custom');
const uglifyify = require('uglifyify');

// options
const env = 'production';

const babelOpts = {
    "presets": [
        "@babel/env",
        "@babel/react"
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties"
    ],
    "env": {
        "development": {
            "plugins": [
                'react-hot-loader/babel'
            ]
        }
    }
};

const uglifyOpts = {};

const htmlMinOpts = {
    collapseWhitespace: true
};

const envifyOpts = {
    NODE_ENV: env
};

// the index.html files
gulp.task('html', () => {
    return gulp
        .src('src/popup/popup.html')
        .pipe(gulpif(env === 'production', htmlmin(htmlMinOpts)))
        .pipe(gulpif(env === 'development', livereload()))
        .pipe(gulp.dest('extension/'));
});

// .sass files
gulp.task('css', () => {
    return gulp
        .src('src/popup/popup.sass')
        .pipe(sass())
        .pipe(gulpif(env === 'production', clean_css()))
        .pipe(gulpif(env === 'development', livereload()))
        .pipe(gulp.dest('extension/'));
});

// js files
function js(src, dest) {
    const browserifyArgs = Object.assign({}, {
        entries: [src]
    });

    const b = browserify(browserifyArgs)
        .plugin(watchify)
        .transform(babelify, Object.assign({}, babelOpts))
        .transform(envifyify(envifyOpts));

    if (env === 'production') {
        b.transform(uglifyify, uglifyOpts);
    }

    if (env === 'development' && src === "src/popup/app.js") {
        b.plugin(hmr, {disableHostCheck: true});
    }

    function bundle() {

        return b.bundle()
            .on("error", function (err) {
                console.error(err);
                this.emit("end");
            })
            .pipe(source(dest))
            .pipe(buffer())
            .pipe(envify(envifyOpts))
            .pipe(gulpif(env === 'production', uglify()))
            .pipe(gulp.dest('./extension/'));
    }

    b.on("update", bundle);

    return bundle();
}

gulp.task('js-popup', () => {
    return js("src/popup/app.js", "popup.js");
});

gulp.task('js-background', () => {
    return js("src/background.js", "background.js");
});

gulp.task('js-content', () => {
    return js("src/content.js", "content.js");
});

gulp.task('js', gulp.parallel([
    "js-popup",
    "js-background",
    "js-content"
]));

gulp.task('resources', () => {
    return gulp
        .src('resources/**/*')
        .pipe(gulp.dest('extension/'));
});


// build all
gulp.task('build', gulp.series(
    'html',
    'css',
    'js',
    'resources'
));

// start watching all files that are subject to change
gulp.task('watch', () => {
    gulp.watch('src/popup.html', gulp.series('html'));
    gulp.watch('src/popup/**/*.sass', gulp.series('css'));
    livereload.listen();
});

// start a webserver with livereload in app directory
gulp.task('run-webserver', () => {
    return connect.server({
        root: 'extension',
        livereload: true,
        port: 8082
    });
});

gulp.task('debug-popup', gulp.series('build', gulp.parallel('watch', 'run-webserver')));