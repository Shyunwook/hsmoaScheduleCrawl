var gulp = require('gulp');
var zip = require('gulp-zip');
var merge = require('merge-stream');

var zipfile = 'lambda-test.zip';


gulp.task('build', function() {
	var index = gulp.src('index.js')
        .pipe(gulp.dest('build'));

	var cheerio = gulp.src('node_modules/**')
        .pipe(gulp.dest('build/node_modules'));

	return merge(index, cheerio);
});

gulp.task('zip', ['build'], function() {
    return gulp.src('build/**')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'));
});
