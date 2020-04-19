var fs = require('fs');
var path = require('path');
var qiniu = require('qiniu');
var child_process = require('child_process');
var resolve = require('path').resolve

var APPS_FOLDER = '../apps/';

var uploadFileToServer = function(localFile, remoteFolder, callback) {
    console.log(resolve(localFile));
    var filePath = resolve(localFile);
    var fileName = path.basename(filePath);
    console.log("file name=" + fileName);
    var cmd = "scp -P 27322 " + filePath +  " root@67.230.179.46:/var/www/apks/" + remoteFolder + fileName;
    console.log(cmd);
    var ret = child_process.execSync(cmd).toString;
    console.log(ret);
    callback(null);
}


function processApps(root, lists, current, callback) {
	if (current >= lists.length) {
        callback();
        return 0;
    }

	var appDir = lists[current];
	var fullPath = path.join(root, appDir);
    var configFile = path.join(fullPath, "app.json");
    if (fs.existsSync(configFile)) {
    	// 在服务器上建立文件夹
        var remoteFolder = appDir + "/";
        console.log("create remote folder: " + remoteFolder);
        child_process.execSync("ssh -p 27322 root@67.230.179.46 " + "'mkdir -p /var/www/apks/" + remoteFolder + "'")
        uploadFileToServer(configFile, remoteFolder, function() {
        	console.log("uploadFileToServer file=" + configFile + " success.");
        	processApps(root, lists, current + 1, callback);
        });
    } else {
    	processApps(root, lists, current + 1, callback);
    }
}

//// 遍历存放所有app的目录
function travelApps(root) {
	console.log("path=" + __path)

	console.log("上传图标");
	child_process.execSync("sh ./uploadIcon.sh");
	console.log("上传图标完成");

    var lists = fs.readdirSync(root);
    console.log(lists);
    var appsConfig = path.join(root, "apps.json");
    console.log("全部应用: " + appsConfig);
    uploadFileToServer(appsConfig, "", function() {
		processApps(root, lists, 0, function() {
        	console.log("处理完成");
    	});
    });

   

}

travelApps(APPS_FOLDER);