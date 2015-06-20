var markdown = require('markdown').markdown;
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');
var marked = require('marked');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

//replace(/<!--\s*include\s+(['"])([^'"]+)\.(less|scss|coffee|css|js|inc\.[^'"]+)\1\s*(.*?)\s*-->/mg, (full, quote, incName, ext, params) ->

var compile = function(file, opt) {
    var template = fs.readFileSync(opt.baseLayout, 'utf-8');
    //console.log(template);
    var content = file.contents.toString();
    var htmlContent = marked(content);

    var out = template.replace(/<!--\s*markdown\s*-->/mg, function(full) {
        return htmlContent;
    });
    return out;
}

module.exports = function(opt) {
    return through.obj(function(file, enc, next) {
        var content = compile(file, opt);
        file.contents = new Buffer(content);
        file.path = gutil.replaceExtension(file.path, '.html');
        this.push(file);
        next();
    });
};