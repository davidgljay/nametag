'use strict'

let gulp = require('gulp')
let del = require('del')
let fs = require('fs')

let path = require('path')

// Load plugins
let $ = require('gulp-load-plugins')()
let browserify = require('browserify')
let watchify = require('watchify')
let source = require('vinyl-source-stream')
let sourceFile = './app/scripts/app.js'
let destFolder = './dist/public/scripts'
let destFileName = 'app.js'
let browserSync = require('browser-sync')
let reload = browserSync.reload

// Styles
gulp.task('styles', ['moveCss'])

gulp.task('moveCss',['clean'], function() {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure

  gulp.src(['./app/styles/**/*.css'], { base: './app/styles/' })
  .pipe(gulp.dest('dist/public/styles'))
})

gulp.task('moveIcons', ['clean'], function() {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/icons/**/*.svg'], { base: './app/icons/' })
  .pipe(gulp.dest('dist/icons'))
  gulp.src(['./app/favicon.ico'])
  .pipe(gulp.dest('dist/public'))
})

// gulp.task('sass', function() {
//     return $.rubySass('./app/styles', {
//             style: 'expanded',
//             precision: 10,
//             loadPath: ['app/bower_components']
//         })
//         .pipe($.autoprefixer('last 1 version'))
//         .pipe(gulp.dest('dist/styles'))
//         .pipe($.size())
// })

// gulp.task('css-modules', function() {
//   let b = browserify()
//   b.add(sourceFile)
//   b.plugin(['css-modulesify', {
//     output: './dist/styles/main.css',
//   }])
//
//   return b.bundle()
// })

let bundler = watchify(browserify({
  entries: [sourceFile],
  debug: true,
  plugin:['css-modulesify'],
  insertGlobals: true,
  cache: {},
  packageCache: {},
  fullPaths: true,
}))

bundler.on('update', rebundle)
bundler.on('log', $.util.log)

function rebundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source(destFileName))
    .pipe(gulp.dest(destFolder))
    .on('end', function() {
      reload()
    })
}

// Scripts
gulp.task('scripts', rebundle)

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFileName))
        .pipe(gulp.dest('dist/scripts'))
})

// HTML
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size())
})

// Images
gulp.task('images', function() {
  return gulp.src(['app/images/**/*'], { base: './app/images/'})
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/public/images'))
    .pipe($.size())
})

// Fonts
gulp.task('fonts', function() {

  return gulp.src(require('main-bower-files')({
          filter: '**/*.{eot,svg,ttf,woff,woff2}'
      }).concat('app/fonts/**/*'))
      .pipe(gulp.dest('dist/public/fonts'))

})

// Clean
gulp.task('clean', function(cb) {
    $.cache.clearAll()
    cb(del.sync(['dist/public/*']))
})

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function() {
  return gulp.src('./app/index.html')
    .pipe($.useref.assets())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist/public'))
})

gulp.task('buildBundle', ['styles', 'buildScripts'], function() {
  return gulp.src('./app/index.html')
    .pipe($.useref.assets())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist/public'))
})

// Move JS Files and Libraries
gulp.task('moveLibraries', ['clean'], function() {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/scripts/**/*.js'], { base: './app/scripts/' })
  .pipe(gulp.dest('dist/public/scripts'))
})


// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*', {
            base: 'app/bower_components',
        })
        .pipe(gulp.dest('dist/public/bower_components/'))

})

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {
            base: 'app/scripts',
        })
        .pipe(gulp.dest('dist/public/scripts/'))
})

// Robots.txt and favicon.ico
gulp.task('extras', function() {
    return gulp.src(['app/*.txt', 'app/*.ico'])
        .pipe(gulp.dest('dist/public/'))
        .pipe($.size())
})

// Watch
gulp.task('watch', ['html', 'fonts', 'styles', 'images', 'bundle'], function() {

    browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['dist', 'app'],
    })

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json'])

    // Watch .html files
    gulp.watch('app/*.html', ['html'])

    gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['styles', 'scripts', reload])

    // Watch image files
    gulp.watch('app/images/**/*', ['images', reload])
})

// Build
gulp.task('build', ['html', 'buildBundle', 'images', 'fonts', 'extras'], function() {
    gulp.src('dist/scripts/app.js')
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest('dist/public/scripts'))
})

// Default task
gulp.task('default', ['clean', 'build', 'jest'  ])
