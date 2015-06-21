#cocos2d-x Lua编译成二进制

##编译cocos2dx自带的luajit
1. 进入目录external/lua/luajit/src
2. 运行命令make && make install

##编译使用的命令
```
luajit -b main.lua ../bytecode/main.lua
```

##批处理
使用js脚本进行批处理，把src的lua文件编译到bytecode目录里面

```
#!/usr/bin/env node

var fs = require('fs');
var spawn = require('child_process').spawn

var src = "./";
var dest = "../bytecode/";

function filter(path) {
	var extendName = path.substring(path.lastIndexOf('.')+1, path.length);
	extendName = extendName.toLowerCase();
	if (extendName == "lua") {
		return true;
	}
	return false;
}

(function build(src, dest) {
	var lists = fs.readdirSync(src);
	var tempDirs = [];
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest);
	}
	lists.forEach(function(path) {
		var fullSrcPath = src + path;
		var fullDestPath = dest + path;
		var stats = fs.lstatSync(fullSrcPath);
		if (stats.isFile()) {
			if (filter(fullSrcPath)) {
				console.log("luajit -b " + fullSrcPath + " " + fullDestPath);
				var ps = spawn("luajit", ["-b", fullSrcPath, fullDestPath]);
				ps.on('error', function (data) {
					console.log('stderr: ' + data);
				});
			}
		} else if(stats.isDirectory()) {
			tempDirs.push(path);
		}
	});
	tempDirs.forEach(function(path) {
		build(src + path + "/", dest + path + "/");
	});
})(src, dest);
```
在src目录下面运行命令 Luajitbuild.js。

##修改Android的编译配置
编译发布版本的时候，要把src目录移除，把bytecode加入到复制路径。

打开proj.android/build-cfg.json

修改：

```
{
    "from": "../../../src",
    "to": "src",
    "exclude": [
        "*.gz"
    ]
}

```

为

```
{
    "from": "../../../bytecode",
    "to": "bytecode",
    "exclude": [
        "*.gz"
    ]
},
        
```

##修改游戏入口文件
打开`config.json`文件，把`entry`变量改成bytecode下的`main.lua`

##Ok，大功告成