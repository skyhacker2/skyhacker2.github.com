# Xcode6编译Cocos2d-x3.1.1 link错误

```
Undefined symbols for architecture x86_64:
  "_opendir$INODE64", referenced from:
      _OPENSSL_DIR_read in libcocos2dx iOS.a(o_dir.o)
  "_readdir$INODE64", referenced from:
      _OPENSSL_DIR_read in libcocos2dx iOS.a(o_dir.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

原来苹果公司打算自己整一套OPenGL的东西，所有，有些东西需要根据IOS平台来加入它的东西。这个问题的解决方案如下：

在工程目录下cocos/platform/CCImage.cpp添加如下代码：

```
extern "C"
{
#ifndef __ENABLE_COMPATIBILITY_WITH_UNIX_2003__
#define __ENABLE_COMPATIBILITY_WITH_UNIX_2003__
#include <stdio.h>
#include <dirent.h>
    FILE *fopen$UNIX2003( const char *filename, const char *mode )
    {
        return fopen(filename, mode);
    }
    size_t fwrite$UNIX2003( const void *a, size_t b, size_t c, FILE *d )
    {
        return fwrite(a, b, c, d);
    }
    char *strerror$UNIX2003( int errnum )
    {
        return strerror(errnum);
    }
    DIR *opendir$INODE64(const char * a)
    {
        return opendir(a);
    }
    
    struct dirent *readdir$INODE64(DIR *dir)
    {
        return readdir(dir);
    }
#endif
#include "png.h"
#include "tiffio.h"
#include "base/etc1.h"
#include "jpeglib.h"
}

```

参考文档：

http://discuss.cocos2d-x.org/t/cocos2dx-with-ios-8-will-work/14621

https://github.com/cocos2d/cocos2d-x/pull/6986
