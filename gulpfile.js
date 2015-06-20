var gulp = require('gulp');
var builder = require('silent-builder');

gulp.task('build', function() {
    gulp.src('./blog/p/**/*.md')
        .pipe(builder({baseLayout: "./blog/index.html"}))
        .pipe(gulp.dest('./blog/posts/'));
});

gulp.task('default',['build']);