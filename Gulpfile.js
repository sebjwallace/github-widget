var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('lib', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('dev', function() {
  return browserify('./src/githubWidget.js',{
        standalone: 'GithubWidget'
    })
    .transform(babelify)
    .bundle()
    .pipe(source('githubWidget.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist', function() {
  return browserify('./src/githubWidget.js',{
        standalone: 'GithubWidget'
    })
    .transform(babelify)
    .bundle()
    .pipe(source('githubWidget.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['dev','dist','lib']);
