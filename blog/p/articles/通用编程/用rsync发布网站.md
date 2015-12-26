# 用rsync发布网站

```
#!/bin/sh
serverLogin="root@x.x.x.x"
serverSiteRoot="/var"
serverBasePath="web"
clientBasePath="./"

rsync -av --exclude-from=exclude.list ${clientBasePath} ${serverLogin}:${serverSiteRoot}/${serverBasePath}
ssh ${serverLogin} "cd ${serverSiteRoot}/${serverBasePath}; forever restart index.js"

```

rsync真是神器啊。之前用scp上传文件到服务器，每次都要把全部文件上传，rsync可以判断服务器的文件，做到增量更新。

rsync还可以加exclude文件用来过滤不想上传的文件，简直棒棒哒。

每次从10多分钟变成1秒钟。
