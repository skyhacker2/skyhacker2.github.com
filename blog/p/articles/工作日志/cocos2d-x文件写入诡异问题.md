#cocos2d-x文件写入诡异问题

##char m_filePath[100]成员变量

```
class UltrasonicWaveCreator
{
public:
    
    ~UltrasonicWaveCreator();
    
    static UltrasonicWaveCreator* sharedUltrasionicWaveCreator();
    
    void puts(char *str);
    
protected:
    
    UltrasonicWaveCreator();
    
    bool init();
    
    static UltrasonicWaveCreator *s_ultrasonicWaveCreator;
    
    char m_filePath[100];  
    
};
```

```
#include "UltrasonicWave.h"
#include "cocos2d.h"
using namespace std;
USING_NS_CC;

// 初始化静态变量
UltrasonicWaveCreator* UltrasonicWaveCreator::s_ultrasonicWaveCreator = NULL;

UltrasonicWaveCreator::UltrasonicWaveCreator()
{

}

UltrasonicWaveCreator::~UltrasonicWaveCreator()
{

}

UltrasonicWaveCreator* UltrasonicWaveCreator::sharedUltrasionicWaveCreator()
{
    if (s_ultrasonicWaveCreator == NULL) {
        s_ultrasonicWaveCreator = new UltrasonicWaveCreator();
        s_ultrasonicWaveCreator->init();
    }
    return s_ultrasonicWaveCreator;
}

bool UltrasonicWaveCreator::init()
{

    string path = CCFileUtils::sharedFileUtils()->getWritablePath();
    string fullPath  = path + "test.txt";
    strcpy(m_filePath, fullPath.c_str());
    
    return true;
}

void UltrasonicWaveCreator::puts(char *str)
{
    //string path = CCFileUtils::sharedFileUtils()->getWritablePath();
    //string fullPath  = path + "test.txt";

    FILE *out = fopen(m_filePath, "w");
    fputs("testing", out);
    fclose(out);
}
```

**运行报错**
![image](http://git.oschina.net/nov_eleven/photo/raw/master/201304080314.jpg)

**数据已经写进去了**
![image](http://git.oschina.net/nov_eleven/photo/raw/master/201404081514.jpg)

##下面两种情况不会报错
1. 用string代替char。
2. 用临时变量。

不知道是不是跟oc的内存管理有关。