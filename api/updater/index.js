var ApkReader = require('node-apk-parser');
var fs = require('fs');
var path = require('path');
var qiniuConfig = require('./qiniu.json');
var qiniu = require('qiniu');

var APPS_FOLDER = '../apps/';
var channelMaps = {};

qiniu.conf.ACCESS_KEY = qiniuConfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qiniuConfig.SECRET_KEY;

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

/// 获取apk的信息
var getManifest = function(apk) {
    if (!apk.endsWith('apk')) {return null;}
    var reader = ApkReader.readFile(apk);
    var manifest = reader.readManifestSync();
    // console.log('apk versionCode: ' + manifest.versionCode);
    // console.log('apk versionName: ' + manifest.versionName);
    return manifest;
}

function getApksInfo(apksDir) {
    var apks = fs.readdirSync(apksDir);
    var infos = [];
    for (var i = 0; i < apks.length; i++) {
        var manifest = getManifest(path.join(apksDir, apks[i]));
        if (manifest){
            for (var j = 0; j < manifest.application.metaDatas.length; j++) {
                if (manifest.application.metaDatas[j]["name"] == "UMENG_CHANNEL") {
                    channelMaps[apks[i]] = manifest.application.metaDatas[j]["value"];
                }
            }
            
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
        if (first.versionCode != infos[i].versionCode) {
            console.log("apk版本号不一致");
            return existsConfig;
        }
    }
    if (existsConfig.versionCode >= first.versionCode) {
        console.log("versionCode比目前的小 " + first.versionCode);
        return existsConfig;
    }

    existsConfig.versionCode = first.versionCode;
    existsConfig.versionName = first.versionName;
    existsConfig.channels = {};

    for (var i = 0; i < infos.length; i++) {
        var metaDatas = infos[i].application.metaDatas;
        for (var j = 0; j < metaDatas.length; j++) {
            if (metaDatas[j]["name"] == "UMENG_CHANNEL") {
                // console.log(metaDatas[j]["value"]);
                existsConfig.channels[metaDatas[j]["value"]] = "";
            }
        }
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

function uploadApks(appName, apksDir, apkNames, current, config, callback) {
    if (current >= apkNames.length) {
        callback();
        return 0;
    }
    var apkName = apkNames[current];
    if (apkName.endsWith('apk')) {
        var apkPath= path.join(apksDir, apkName);
        var key = appName + "/" + apkName;
        var token = uptoken(key);
        uploadFileToQiniu(token, key, apkPath, function(err, ret) {
            if (!err) {
                console.log("上传" + apkName + "成功!");
                config.channels[channelMaps[apkName]] = qiniuConfig.DOWNLOAD_URL + ret.key;
                if (fs.existsSync(apkPath)) {
                    fs.unlinkSync(apkPath);
                }
                uploadApks(appName, apksDir, apkNames, current+1, config, callback);
            } else {
                console.log("上传 " + apkName + " 发生错误，终止!");
            }

        });
    } else {
        uploadApks(appName, apksDir, apkNames, current+1, config, callback);
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
            uploadApks(appDir, apksDir, apkNames, 0, config, function() {
                fs.writeFileSync(path.join(fullPath, 'app.json'), JSON.stringify(config, null, 4));
                processApps(root, lists, current+1, callback);
            });
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
    // lists.forEach(function(appDir) {
    //     var fullPath = path.join(root, appDir);
    //     var stats = fs.lstatSync(fullPath);
    //     if (stats.isDirectory()) {
    //         var apksDir = path.join(fullPath, "apks");
    //         if (fs.existsSync(apksDir)) {
    //             var infos = getApksInfo(apksDir);
    //             var existsConfig = getExistsConfig(fullPath);
    //             var versionCode = existsConfig.versionCode;
    //             var config = updateApkInfoConfig(infos, existsConfig);

    //             if (versionCode == config.versionCode) {
    //                 console.log("return!");
    //                 return;
    //             }
    //             console.log(config);
    //             var apkNames = fs.readdirSync(apksDir);
    //             uploadApks(appDir, apksDir, apkNames, 0, config, function() {
    //                 fs.writeFileSync(path.join(fullPath, 'app.json'), JSON.stringify(config, null, 4));
    //             });
    //         }
    //     }

    // });
}

travelApps(APPS_FOLDER);