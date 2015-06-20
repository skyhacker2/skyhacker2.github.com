var gulp = require('gulp');
var builder = require('./index');

gulp.task('build', function() {
    gulp.src('./blog/p/**/*.md')
        .pipe(builder({basePath: './blog/'}))
        .pipe(gulp.dest('./blog/posts/'));
});

gulp.task('default',['build']);