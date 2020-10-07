# 上传到github
git add ./
git commit -m 'update'
git push origin master
git push gitee master

# 上传配置文件到服务器
cd api/updater
node ./publish_config.js