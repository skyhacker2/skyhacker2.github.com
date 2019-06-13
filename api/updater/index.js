var fs = require('fs');
var path = require('path');
var qiniu = require('qiniu');
var child_process = require('child_process');
var resolve = require('path').resolve

var APPS_FOLDER = '../apps/';
var channelMaps = {};

qiniu.conf.ACCESS_KEY = "";
qiniu.conf.SECRET_KEY = "";

var bucket = 'apps';
// 构建上传策略函数
var uptoken = function(key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}
var uploadFileToQiniu = function(uptoken, key, localFile, callback) {
    console.log('正在上传' + key + '到七牛....');
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret);
            callback(err, ret);       
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
            callback(err);
        }
  });
}

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

/// 获取apk的信息
var getManifest = function(apk) {
    if (!apk.endsWith('apk')) {return null;}
    var info = child_process.execSync("aapt d --include-meta-data badging " + apk).toString();
    var versionCode = /package:.*versionCode='([^\n\']+)'/g.exec(info)[1];
    var versionName = /package:.*versionName='([^\n\']+)'/g.exec(info)[1];
    var channel = /meta-data: name='UMENG_CHANNEL' value='([^\n\']+)'/g.exec(info)[1];
    var manifest = {
        versionCode: parseInt(versionCode),
        versionName: versionName,
        channel: channel
    };
    console.log(manifest);
    return manifest;
}

function getApksInfo(apksDir) {
    var apks = fs.readdirSync(apksDir);
    var infos = [];
    for (var i = 0; i < apks.length; i++) {
        var manifest = getManifest(path.join(apksDir, apks[i]));
        if (manifest){
            channelMaps[apks[i]] = manifest.channel;
            infos.push(manifest);
        }
        // console.log(manifest.application.metaDatas);
    }
    // console.log(channelMaps);
    return infos;
}

function updateApkInfoConfig(infos, existsConfig) {
    if (infos.length == 0){
        return existsConfig;
    }
    var first = infos[0];
    for (var i = 1; i < infos.length; i++){
        console.log("firstVersionCode " + first.versionCode);
        console.log("versionCode " + infos[i].versionCode);
        if (first.versionCode != infos[i].versionCode) {
            console.log("apk版本号不一致");
            return existsConfig;
        }
    }
    if (existsConfig.versionCode >= first.versionCode) {
        console.log("versionCode比目前的小 " + first.versionCode + " " + existsConfig.versionCode);
        return existsConfig;
    }

    existsConfig.versionCode = first.versionCode;
    existsConfig.versionName = first.versionName;
    existsConfig.channels = {};

    for (var i = 0; i < infos.length; i++) {
        var channel = infos[i].channel;
        existsConfig.channels[channel] = "";
    }

    return existsConfig;
}

function getExistsConfig(root) {
    var configFile = path.join(root, "app.json");
    if (fs.existsSync(configFile)) {
        var config = fs.readFileSync(configFile, "utf-8");
        config = JSON.parse(config);
        return config;
    } else {
        return {
            versionCode: -1,
            versionName: ""
        }
    }
}

function uploadApks(remoteFolder, appName, apksDir, apkNames, current, config, callback) {
    if (current >= apkNames.length) {
        callback();
        return 0;
    }
    console.log("appName=" + appName + "version=" + config.versionName);
    var apkName = apkNames[current];
    if (apkName.endsWith('apk')) {
        var apkPath= path.join(apksDir, apkName);
        // var key = appName + "/" + apkName;
        // var token = uptoken(key);
        // uploadFileToQiniu(token, key, apkPath, function(err, ret) {
        //     if (!err) {
        //         console.log("上传" + apkName + "成功!");
        //         config.channels[channelMaps[apkName]] = qiniuConfig.DOWNLOAD_URL + ret.key;
        //         if (fs.existsSync(apkPath)) {
        //             fs.unlinkSync(apkPath);
        //         }
        //         uploadApks(appName, apksDir, apkNames, current+1, config, callback);
        //     } else {
        //         console.log("上传 " + apkName + " 发生错误，终止!");
        //     }

        // });
        uploadFileToServer(apkPath, remoteFolder, function(err, ret) {
            if (!err) {
                console.log("上传" + apkName + "成功!");
                config.channels[channelMaps[apkName]] = "http://d.apptor.me/" + remoteFolder + apkName;
                if (fs.existsSync(apkPath)) {
                    fs.unlinkSync(apkPath);
                }
                uploadApks(remoteFolder, appName, apksDir, apkNames, current+1, config, callback);
            } else {
                console.log("上传 " + apkName + " 发生错误，终止!");
            }

        });
    } else {
        uploadApks(remoteFolder, appName, apksDir, apkNames, current+1, config, callback);
    }
}

function processApps(root, lists, current, callback) {
    if (current >= lists.length) {
        callback();
        return 0;
    }
    var appDir = lists[current];
    var fullPath = path.join(root, appDir);
    var stats = fs.lstatSync(fullPath);
    if (stats.isDirectory()) {
        var apksDir = path.join(fullPath, "apks");
        if (fs.existsSync(apksDir)) {
            var infos = getApksInfo(apksDir);
            var existsConfig = getExistsConfig(fullPath);
            var versionCode = existsConfig.versionCode;
            var config = updateApkInfoConfig(infos, existsConfig);

            if (versionCode == config.versionCode) {
                console.log("跳过" + appDir);
                processApps(root, lists, current+1, callback);
                return;
            }
            // console.log(config);
            var apkNames = fs.readdirSync(apksDir);
            // 在服务器上建立文件夹
            var remoteFolder = appDir + "/" + config.versionName + "/";
            console.log("create remote folder: " + remoteFolder);
            child_process.execSync("ssh -p 27322 root@67.230.179.46 " + "'mkdir -p /var/www/apks/" + remoteFolder + "'")
            uploadApks(remoteFolder, appDir, apksDir, apkNames, 0, config, function() {
                fs.writeFileSync(path.join(fullPath, 'app.json'), JSON.stringify(config, null, 4));
                processApps(root, lists, current+1, callback);
            });
        } else {
            console.log("跳过" + appDir);
            processApps(root, lists, current+1, callback);
        }
    } else {
        processApps(root, lists, current+1, callback);
    }
}

//// 遍历存放所有app的目录
function travelApps(root) {
    var lists = fs.readdirSync(root);
    console.log(lists);
    processApps(root, lists, 0, function() {
        console.log("处理完成");
    });
}

travelApps(APPS_FOLDER);