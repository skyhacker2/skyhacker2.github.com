#Cocos2d-x 3.1 Lua实现游戏代码更新

## 绑定需要的C++辅助函数
因为不同平台的操作目录的函数可能不一样，主要有三个函数：

```
createDownloadDir() // 创建下载目录
deleteDownloadDir() // 删除下载目录
addSearchPath() // 添加搜索路径

```
绑定方法请参考：[Cocos2d-x 3.1 lua bindings](http://www.ihunuo.com:8081/index.php/Cocos2d-x_3.1_lua_bindings)

###lua_assetsmanager_test_sample.h

```
#ifndef COCOS2DX_COCOS_SCRIPTING_LUA_BINDINGS_LUA_ASSETSMANAGER_TEST_SAMPLE_H
#define COCOS2DX_COCOS_SCRIPTING_LUA_BINDINGS_LUA_ASSETSMANAGER_TEST_SAMPLE_H

#ifdef __cplusplus
extern "C" {
#endif
#include "tolua++.h"
#ifdef __cplusplus
}
#endif

/**
 * The apis which are bound in this file are temporary for the assetsmanager test sample.After the completion of some systems like fileutils,these apis will be deprecated 
 */
TOLUA_API int register_assetsmanager_test_sample(lua_State* tolua_S);

#endif // #ifndef COCOS2DX_COCOS_SCRIPTING_LUA_BINDINGS_LUA_ASSETSMANAGER_TEST_SAMPLE_H


```

###lua_assetsmanager_test_sample.cpp

```
#include "lua_assetsmanager_test_sample.h"

#ifdef __cplusplus
extern "C" {
#endif
#include  "tolua_fix.h"
#ifdef __cplusplus
}
#endif

#include "cocos2d.h"
#include "extensions/cocos-ext.h"

#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
#include <dirent.h>
#include <sys/stat.h>
#endif

USING_NS_CC;
USING_NS_CC_EXT;


static int lua_cocos2dx_createDownloadDir(lua_State* L)
{
    if (nullptr == L)
        return 0;
    
    int argc = lua_gettop(L);

    if (0 == argc)
    {
        std::string pathToSave = FileUtils::getInstance()->getWritablePath();
        pathToSave += "tmpdir";
        
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
        DIR *pDir = NULL;
        
        pDir = opendir (pathToSave.c_str());
        if (! pDir)
        {
            mkdir(pathToSave.c_str(), S_IRWXU | S_IRWXG | S_IRWXO);
        }
#else
        if ((GetFileAttributesA(pathToSave.c_str())) == INVALID_FILE_ATTRIBUTES)
        {
            CreateDirectoryA(pathToSave.c_str(), 0);
        }
#endif
        tolua_pushstring(L, pathToSave.c_str());
        return 1;
    }
    
    CCLOG("'createDownloadDir' function wrong number of arguments: %d, was expecting %d\n", argc, 0);
    return 0;
}

static int lua_cocos2dx_deleteDownloadDir(lua_State* L)
{
    if (nullptr == L)
        return 0;
    
    int argc = lua_gettop(L);
    
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif
    
    if (1 == argc)
    {
#if COCOS2D_DEBUG >= 1
        if (!tolua_isstring(L, 1, 0, &tolua_err)) goto tolua_lerror;
#endif
        std::string pathToSave = tolua_tostring(L, 1, "");
        
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
        std::string command = "rm -r ";
        // Path may include space.
        command += "\"" + pathToSave + "\"";
        system(command.c_str());
#else
        std::string command = "rd /s /q ";
        // Path may include space.
        command += "\"" + pathToSave + "\"";
        system(command.c_str());
#endif
        return 0;
    }
    
    CCLOG("'resetDownloadDir' function wrong number of arguments: %d, was expecting %d\n", argc, 1);
    return 0;
    
#if COCOS2D_DEBUG >= 1
tolua_lerror:
    tolua_error(L,"#ferror in function 'resetDownloadDir'.",&tolua_err);
    return 0;
#endif
}

static int lua_cocos2dx_addSearchPath(lua_State* L)
{
    if (nullptr == L)
        return 0;
    
    int argc = lua_gettop(L);
    
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif
    
    
    if (2 == argc)
    {
#if COCOS2D_DEBUG >= 1
        if (!tolua_isstring(L, 1, 0, &tolua_err) ||
            !tolua_isboolean(L, 2, 0, &tolua_err))
            goto tolua_lerror;
#endif
        std::string pathToSave = tolua_tostring(L, 1, "");
        bool before           = tolua_toboolean(L, 2, 0);
        std::vector<std::string> searchPaths = FileUtils::getInstance()->getSearchPaths();
        if (before)
        {
            searchPaths.insert(searchPaths.begin(), pathToSave);
        }
        else
        {
            searchPaths.push_back(pathToSave);
        }
        
        FileUtils::getInstance()->setSearchPaths(searchPaths);
        
        return 0;
    }
    CCLOG("'addSearchPath' function wrong number of arguments: %d, was expecting %d\n", argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
tolua_lerror:
    tolua_error(L,"#ferror in function 'addSearchPath'.",&tolua_err);
    return 0;
#endif
}

int register_assetsmanager_test_sample(lua_State* L)
{
    tolua_open(L);
    tolua_module(L, NULL, 0);
    tolua_beginmodule(L, NULL);
    tolua_function(L, "createDownloadDir", lua_cocos2dx_createDownloadDir);
    tolua_function(L, "deleteDownloadDir", lua_cocos2dx_deleteDownloadDir);
    tolua_function(L, "addSearchPath", lua_cocos2dx_addSearchPath);
    tolua_endmodule(L);
    return 0;
}

```

## 使用AssertManager检查和更新文件

###初始化
```
local pathToSave = createDownloadDir()
assetsManager = cc.AssetsManager:new("http://192.168.0.105:8080/package.zip",
                "http://192.168.0.105:8080/version",
                pathToSave)
assetsManager:retain()
assetsManager:setDelegate(onError, cc.ASSETSMANAGER_PROTOCOL_ERROR )
assetsManager:setDelegate(onProgress, cc.ASSETSMANAGER_PROTOCOL_PROGRESS)
assetsManager:setDelegate(onSuccess, cc.ASSETSMANAGER_PROTOCOL_SUCCESS )
assetsManager:setConnectionTimeout(3)
```

###处理函数

```
local function onError(errorCode)
    if errorCode == cc.ASSETSMANAGER_NO_NEW_VERSION then
        self.layer.processLabel:setString("no new version")
    elseif errorCode == cc.ASSETSMANAGER_NETWORK then
        self.layer.processLabel:setString("network error")
    end
end

local function onProgress( percent )
    self.layer.processLabel:setString(string.format("downloading %d%%",percent))
end

local function onSuccess()
    self.layer.processLabel:setString("Download ok!")
end
```

###设置搜索路径

```
addSearchPath(pathToSave .. "/package", true)
addSearchPath(pathToSave .. "/package/res", true)
addSearchPath(pathToSave .. "/package/src", true)
addSearchPath(pathToSave .. "/package/res/hd", true)
```