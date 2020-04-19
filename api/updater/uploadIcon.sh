#!/bin/sh
serverPort="27322"
serverLogin="root@67.230.179.46"
serverSiteRoot="/var/www/apks"
serverBasePath=""
clientBasePath="../apps/icons"

rsync -av -e "ssh -p ${serverPort}" ${clientBasePath} ${serverLogin}:${serverSiteRoot}/${serverBasePath}
