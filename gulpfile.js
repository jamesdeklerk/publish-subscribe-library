// =======================================================
// Required files & Directories
// =======================================================
var browsersync = require('browser-sync'),
    reload = browsersync.reload,
    gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    // Using tsconfig.json
    typescriptProject = typescript.createProject('tsconfig.json'),
    // Directories
    sourceDirectory = 'src/',
    buildDirectory = 'build/',
    typescriptDirectory = sourceDirectory,
    htmlDirectory = buildDirectory,
    cssDirectory = buildDirectory + 'css/',
    javascriptDirectory = buildDirectory + 'javascript/';
// -------------------------------------------------------



// =======================================================
// Recompile tasks
// =======================================================

// Compile TypeScript to JavaScript - using tsconfig.json
gulp.task('recompile:typescript', function () {
    return typescriptProject.src()
        .pipe(typescript(typescriptProject))
        .pipe(gulp.dest(javascriptDirectory));
});

// Recompile watch task - watches for files to recompile
gulp.task('recompile:watch', function () {
    gulp.watch(typescriptDirectory + '**/*.ts', ['recompile:typescript']);
});

// Recompile task - recompiles all files
gulp.task('recompile', ['recompile:typescript']);

// -------------------------------------------------------



// =======================================================
// Reload tasks - for Browsersync
// =======================================================

// Browsersync Task
gulp.task('browsersync', function () {
    browsersync({
        server: {
            baseDir: "./" + buildDirectory // setting the base directory
        }
    });
});

// Reload HTML
gulp.task('reload:html', function () {
    gulp.src(htmlDirectory + '**/*.html')
        .pipe(reload({
            stream: true
        }));
});

// Reload CSS
gulp.task('reload:css', function () {
    gulp.src(cssDirectory + '**/*.css')
        .pipe(reload({
            stream: true
        }));
});

// Reload JavaScript
gulp.task('reload:javascript', function () {
    gulp.src(javascriptDirectory + '**/*.js')
        .pipe(reload({
            stream: true
        }));
});

// Reload watch task - watches for files to reload
gulp.task('reload:watch', function () {
    gulp.watch(htmlDirectory + '**/*.html', ['reload:html']);
    gulp.watch(cssDirectory + '**/*.css', ['reload:css']);
    gulp.watch(javascriptDirectory + '**/*.js', ['reload:javascript']);
});

// Reload task - starts Browsersync & reloads all files
gulp.task('reload', ['browsersync', 'reload:html', 'reload:css', 'reload:javascript']);

// -------------------------------------------------------



// =======================================================
// Default task - starts all others
// =======================================================
gulp.task('default', ['recompile', 'recompile:watch', 'reload', 'reload:watch']);
// -------------------------------------------------------