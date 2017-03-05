# Gradle设置Module路径

代码表示更清楚

```
include ':libcocos2dx', ':libpluginble', ':libpluginmscvoice', ':libtakephoto'
project(':libcocos2dx').projectDir = new File(settingsDir, '../cocos2d/cocos/platform/android/libcocos2dx')
include ':BB8'
project(':BB8').projectDir = new File(settingsDir, 'app')

```