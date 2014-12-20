var gulp = require('gulp'),
    bower = require('bower'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat-util'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    copy = require('gulp-copy'),
    uglify = require('gulp-uglify'),
    annotate = require('gulp-ng-annotate'),
    path = require('path'),
    rev = require('gulp-rev'),
    sourcemaps = require('gulp-sourcemaps'),
    templateCache = require('gulp-angular-templatecache'),
    pkg = require('./package.json'),
    config = {
        port: 5000,
        livereloadport : 35729,
        base: 'www',
        tpl: 'www/**/**/*.tpl.html',
        scss: ['./scss/**/*.scss','www/**/**/*.scss'],
        js: ['www/app/**/**/*.js','!www/app/**/**/*.worker.js'],
        worker: 'www/app/**/**/*.worker.js',
        index: 'www/index.html',
        assets: 'www/assets/**s',
        images: 'src/assets/img/**/*',
        buildName : 'app.js',
        build : 'www/build',
        module : 'app',
        header: ['/**',
          ' * '+pkg.name+' - '+pkg.description,
          ' * @version v '+ pkg.version,
          ' * @link '+pkg.homepage,
          ' * @license '+pkg.license,
          ' */',
          '(function(angular,document) {\'use strict\';\n'
        ].join('\n'),
        footer: '\n})(angular, document);\n'
    };


gulp.task('default', ['dev']);

gulp.task('dev', [
    'lint',
    'buildJs',
    'buildStyle',
    'cacheTemplates',
    'startDevServer',
    'watchSource'
]);

gulp.task('buildJs', function () {
  gulp.src(config.js)
      .pipe(sourcemaps.init())
      .pipe(concat(config.buildName, {process: function(src) { return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
      .pipe(concat.header(config.header))
      .pipe(concat.footer(config.footer))
      .pipe(annotate())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.build))
      .pipe(refresh(lrserver));
});

gulp.task('buildStyle', function () {
  gulp.src(config.scss)
      .pipe(sass())
      .pipe(gulp.dest(config.build));
  gulp.src(config.index)
      .pipe(refresh(lrserver));
});

gulp.task('cacheTemplates', function () {
  gulp.src(config.tpl)
      .pipe(templateCache({module: config.module}))
      .pipe(gulp.dest(config.build))
      .pipe(refresh(lrserver));
});


gulp.task('startDevServer', function () {
  var devServer = express();
  devServer.use(livereload({port: config.livereloadport}));
  devServer.use(express.static(config.base));
  devServer.all('/*', function (req, res) {
    res.sendFile('index.html', {root: config.base});
  });
  devServer.listen(config.port);
  lrserver.listen(config.livereloadport);
});

gulp.task('watchSource', function () {
  gulp.watch(config.js, ['buildJs', 'lint']);
  gulp.watch(config.scss, ['buildStyle']);
  gulp.watch(config.index, ['reloadIndex']);
  gulp.watch(config.tpl, ['cacheTemplates']);
});


gulp.task('reloadIndex', function () {
  gulp.src(config.index)
      .pipe(refresh(lrserver));
});

gulp.task('lint', function () {
  gulp.src(config.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});
