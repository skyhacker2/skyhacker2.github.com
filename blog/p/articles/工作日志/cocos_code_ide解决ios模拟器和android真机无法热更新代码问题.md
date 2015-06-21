#Cocos Code IDE解决ios模拟器和Android真机无法热更新代码问题

修改main.lua文件，在开头加上

```
-- 卸载所有src/下的模块
for k, v in pairs(package.loaded) do
    if(string.find(k, "^src/")) then
        package.loaded[k] = nil
    end
end
```

修改Runtime.cpp文件，添加一些代码

```
bool FileServer::receiveFile(int fd)
{
	moduleName = filename.substr(0, filename.size()-4);
   // ...
    string finish("finish\n");
    send(fd, finish.c_str(), finish.size(),0);
    CCLOG("finish\n");
    // I add these code
    Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
        CCLOG("reload module %s", moduleName.c_str());
        reloadScript(moduleName);
        reloadScript("");
    });
    return true;
}

```
现在可以正常了。
![image](http://git.oschina.net/nov_eleven/photo/raw/master/realtime.gif)