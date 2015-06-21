#Android NDK 编译加入so文件

在cocos2d-x中集成百度语音识别的时候，运行build_native.py会把libs/armeabi目录清空。

以下是解决办法，把so文件放在jni/prebuilt里面。

修改Android.mk文件，主要有两行`include $(CLEAR_VARS)`

```
LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

#百度语音识别so
LOCAL_MODULE := BDVoiceRecognitionClient_V1
LOCAL_SRC_FILES := prebuilt/libBDVoiceRecognitionClient_V1.so
include $(PREBUILT_SHARED_LIBRARY)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2dcpp_shared

```
