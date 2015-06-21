#在Genymotion上运行cocos2d-x游戏

##修改Application.mk文件

```
APP_STL := gnustl_static
APP_ABI := armeabi armeabi-v7a x86
APP_CPPFLAGS := -frtti -DCC_ENABLE_CHIPMUNK_INTEGRATION=1 -DCOCOS2D_DEBUG=1

```

##修改libcocos2dx的Cocos2dxActivity.java

找到`isAndroidEmulator`函数，添加

```
|| product.contains("sdk_") || product.contains("vbox")

```

变成：

```
private final static boolean isAndroidEmulator() {
      String model = Build.MODEL;
      Log.d(TAG, "model=" + model);
      String product = Build.PRODUCT;
      Log.d(TAG, "product=" + product);
      boolean isEmulator = false;
      if (product != null) {
         isEmulator = product.equals("sdk") || product.contains("_sdk") || product.contains("sdk_") || product.contains("vbox");
      }
      Log.d(TAG, "isEmulator=" + isEmulator);
      return isEmulator;
   }
   
```

##解决eclipse里NDK_ROOT没有定义问题

![image](http://git.oschina.net/nov_eleven/photo/raw/master/201405091452.png)