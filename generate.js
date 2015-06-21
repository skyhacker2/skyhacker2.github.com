/**
为一个文件夹生成一个index.md文件
**/
var fs = require('fs');
function usage() {
    console.log("usage: generate.js directory");
}
if (process.argv.length != 3) {
    usage();
    process.exit(1);
}

var rootDir = process.argv[2];
if (rootDir == '-h' || rootDir == '--help') {
    usage();
    process.exit(0);
}
if (!fs.existsSync(rootDir)) {
    console.log("The argument is not exists");
    process.exit(1);
}

var stats= fs.lstatSync(rootDir);
if (!stats.isDirectory()) {
    console.log("The argument is not a directory");
    process.exit(1);
}
ext = {
    md: 'md'
}

// 完整路径映射
var pathMap = {};
var files = [];
if (rootDir[rootDir.length-1] != '/') {
    rootDir += '/';
}

function filter(path) {
    var ss = path.split('.');
    var extendName  = ss.slice(1, ss.length).join('.');
    //console.log(extendName);
    //var extendName = path.substring(path.lastIndexOf('.')+1, path.length);
    extendName = extendName.toLowerCase();
    if (ext[extendName]) {
        //console.log(path);
        files.push(path);
        return true;
    }
    return false;
}


// BFS
function walk(root, filter, fullpath) {
    var lists = fs.readdirSync(root);
    var tmpDirs = [];
    lists.forEach(function(path) {
        //console.log(path);
        var stats = fs.lstatSync(root + path);
        if (stats.isFile()) {
            if (filter(path)) {
                pathMap[path] = fullpath + path;
            }
        } else if(stats.isDirectory()) {
            tmpDirs.push(path);
        }
    });

    tmpDirs.forEach(function(path) {
        walk(root + path + "/" , filter, fullpath + path + "/");
    });
}

function write() {
    var data = ["#工作日志"];
    for (var i = 0; i < files.length; i++) {
        var name = files[i];
        data.push('- [' + name.replace('.md', "") + '](' + name + ')\n');
    }
    fs.writeFileSync(rootDir + "index.md", data.join('\n'));
}

walk(rootDir, filter, "");
write();