#iOS 分析crash日志

##获取crash日志的UUID

找到如下的日志:

```
Binary Images:
0x1000c0000 - 0x1000fbfff Foobler arm64  <b9ad0de234ef32468a591112fa7af209> /var/mobile/Containers/Bundle/Application/887989A9-A6A0-4FC0-80A9-F21C705E2019/Foobler.app/Foobler

```

`b9ad0de234ef32468a591112fa7af209`就是app的UUID.

##找到日志对应的dSYMs文件

```
Foobler.app.dSYM
```

##生成可以看的日志文件

先找到`symbolicatecrash`

`/Applications/Xcode.app/Contents/SharedFrameworks/DTDeviceKitBase.framework/Versions/A/Resources/symbolicatecrash`

获取xcode的目录

`xcode-select --print-path`

```
export DEVELOPER_PATH=XCODE_PATH
./symbolicatecrash Foobler.crash Foobler.app2.dSYM/ > crash.txt
```

##查看对应的代码

打开`crash.txt`文件可以看到类似这样的:

```
Last Exception Backtrace:
0   CoreFoundation                	0x1831c8f48 __exceptionPreprocess + 124
1   libobjc.A.dylib               	0x198673f80 objc_exception_throw + 56
2   CoreFoundation                	0x1831cfc5c -[NSObject(NSObject) doesNotRecognizeSelector:] + 212
3   CoreFoundation                	0x1831ccc00 ___forwarding___ + 872
4   CoreFoundation                	0x1830d0cac _CF_forwarding_prep_0 + 92
5   Foobler                       	0x1000cbd08 0x1000c0000 + 48392
6   Foobler                       	0x1000cb728 0x1000c0000 + 46888
7   UIKit                         	0x188774654 -[UIViewController
```

UIKit的被识别出来了，但是应用对应的代码行数还是没有出来。

接着用atos命令来看对应的行数

找到开始地址：

```
19  Foobler                       	0x1000ec87c 0x1000c0000 + 182396
20  libdyld.dylib                 	0x198eb68b8 start + 4
```

`0x1000c0000`就是开始地址。

运行命令:
```
xcrun atos -o Foobler.app.dSYM/Contents/Resources/DWARF/Foobler -l 0x1000c0000 -arch arm64
```

然后再输入想要看的地址：

```
Elevens-MacBook-Pro:FooblerCarsh eleven$ xcrun atos -o Foobler.app.dSYM/Contents/Resources/DWARF/Foobler -l 0x1000c0000 -arch arm64
0x1000ccd6c
-[FooblerOpsController onManualTimesButtonTouched:] (in Foobler) (FooblerOpsController.m:190)
0x1000d72d0
-[TimerRunningController updateViews] (in Foobler) (TimerRunningController.m:185)
0x1000d6170
-[TimerRunningController viewDidLoad] (in Foobler) (TimerRunningController.m:60)
```
