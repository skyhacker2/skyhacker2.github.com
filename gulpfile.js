var gulp = require('gulp');
var builder = require('./silent-builder');
var destBase = './blog/posts/'
gulp.task('build', function() {
    gulp.src('./blog/p/**/*.md')
        .pipe(builder({baseLayout: "./blog/index2.html"}))
        .pipe(gulp.dest(destBase));
});

gulp.task('copy', function() {
    gulp.src('./blog/p/**/*.+(jpg|jpeg|gif|png|otf|eot|svg|ttf|woff|ico|mp3)')
        .pipe(gulp.dest(destBase));
});

gulp.task('default',['build', 'copy']);