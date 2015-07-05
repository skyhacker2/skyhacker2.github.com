#LED显示屏后记

##遇到的问题

###View和SurfaceView的选择

一开始使用View来做LED的视图，因为不断刷新视图移动文字，导致卡到不行，主要是View是在UI线程中draw的。

SurefaceView主要用来显示视频，它可以在其他线程中更新视图的。

所以最后预览视图使用SurefaceView来实现，新建一个DrawThread来刷新视图。

###EditText不自动获取焦点

设置`windowSoftInputMode`的值

```
<activity
    android:name=".MainActivity"
    android:windowSoftInputMode="adjustUnspecified|stateHidden"
    android:keepScreenOn="true"
    android:label="@string/app_name" >
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

它的设置必须是下面列表中的一个值，或一个”state…”值加一个”adjust…”值的组合。在任一组设置多个值——多个”state…”values，例如＆mdash有未定义的结果。各个值之间用|分开。例如:<activity android:windowSoftInputMode="stateVisible|adjustResize". . . >

各值的含义：
1. stateUnspecified：软键盘的状态并没有指定，系统将选择一个合适的状态或依赖于主题的设置
2. stateUnchanged：当这个activity出现时，软键盘将一直保持在上一个activity里的状态，无论是隐藏还是显示
3. stateHidden：用户选择activity时，软键盘总是被隐藏
4. stateAlwaysHidden：当该Activity主窗口获取焦点时，软键盘也总是被隐藏的
5. stateVisible：软键盘通常是可见的
6. stateAlwaysVisible：用户选择activity时，软键盘总是显示的状态
7. adjustUnspecified：默认设置，通常由系统自行决定是隐藏还是显示
8. adjustResize：该Activity总是调整屏幕的大小以便留出软键盘的空间
9. adjustPan：当前窗口的内容将自动移动以便当前焦点从不被键盘覆盖和用户能总是看到输入内容的部分

### 获取<meta-data>设置的值

```
ApplicationInfo info = getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
Bundle bundle = info.metaData;
String channel = bundle.getString("UMENG_CHANNEL");
```

### 保持屏幕不关闭

加入`android:keepScreenOn="true"`

```
<activity
    android:name=".LEDScreenActivity"
    android:label="@string/title_activity_ledscreen"
    android:screenOrientation="landscape"
    android:keepScreenOn="true"
    android:theme="@style/Theme.AppCompat.Light.NoActionBar.FullScreen" >
</activity>
```

### 调节屏幕亮度到最高

```
WindowManager.LayoutParams layout = getWindow().getAttributes();
layout.screenBrightness = 1.0f;
```

##Reference
[android:windowSoftInputMode属性详解](http://blog.csdn.net/twoicewoo/article/details/7384398)
