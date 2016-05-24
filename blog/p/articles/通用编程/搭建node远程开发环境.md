# 搭建node远程开发环境

## 服务器系统

CentOS 6

## 配置ssh免密码登录

1. 如果没有使用过`ssh-keygen`生成过key的话，先运行一下

```
$ ssh-keygen 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again:
```

注意不要输入密码。

2. 用ssh-copy-id 复制公匙到服务器

先安装`ssh-copy-id`

```
brew install ssh-copy-id
```

```
ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.200.10
```

注意root是我服务器的用户名，要换成自己的。

现在尝试一下`ssh root@192.168.200.10`可以不用密码登录了。

## 安装Mongodb

```
yum install mongodb-org
```

增加用户，为了让外网需要登录连接数据库
```
$ mongo
> use admin
> db.createUser({user:"someadmin",pwd:"secret", roles:[{role:"root",db:"admin"}]})
> exit

# Alias for convenience (optional and at your own risk)
$ echo 'alias mongo="mongo --port 27017 -u someadmin -p secret --authenticationDatabase admin"' >> ~/.bash_profile
$ source ~/.bash_profile

# Add user to your DB
$ mongo
> use some_db
> db.createUser(
    {
      user: "mongouser",
      pwd: "someothersecret",
      roles: ["readWrite"]
    }
)
```

后台运行mongodb
```
mongod --auth &
```

现在电脑可以用mongodb客户端软件连接到服务器上的数据库了。

## 配置rsync同步文件到服务器

新建一个脚本文件`publish.sh`

```
#!/bin/sh
serverPort="22"
serverLogin="root@192.168.200.10"
serverSiteRoot="/var/www"
serverBasePath="fan-server"
clientBasePath="./"

rsync -av --exclude-from=exclude.list ${clientBasePath} ${serverLogin}:${serverSiteRoot}/${serverBasePath}

```

## 配置自动上传

每次都要手动输入publish.sh上传有点蛋疼，利用`fswatch`来监听文件改变并调用`publish.sh`脚本

安装`fswatch`

```
brew install fswatch
```

新建一个脚本`watch-push-server.sh`

```
fswatch -o ./ | xargs -n1 ./publish.sh
```

## 服务端配置文件改变自动重启

安装`nodemom`

```
npm install -g nodemom
nodemom index.js
```

## 完成，可以愉快地写代码了。😂