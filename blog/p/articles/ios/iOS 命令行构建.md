# iOS 命令行构建

## CocoaPods的工程命令
```
xcodebuild -workspace 'Foobler.xcworkspace' -scheme 'Foobler' -configuration 'Release' CONFIGURATION_BUILD_DIR='/Users/eleven/projects/objective-c/Foobler/build/Release-iphoneos' ONLY_ACTIVE_ARCH=NO

```

Foobler是对于的xcworkspace和Scheme名字。

注意：CONFIGURATION_BUILD_DIR必须是绝对路径！！！

-configuration 选项可以有`Release` `Debug` `Distribute`

## Project工程

```
xcodebuild -workspace 'Foobler.xcworkspace' -configuration 'Release'
```
构建好的Foobler.app会在`build/Release-iphoneos`目录下面。

## 打包成ipa

用`/usr/libexec/PlistBuddy`可以操作Info.plist文件。

打印版本号：
```
/usr/libexec/PlistBuddy -c "print CFBundleShortVersionString" /Users/eleven/projects/objective-c/Foobler/build/Release-iphoneos/Foobler.app/Info.plist
```
用xcrun打包成ipa
```
xcrun -sdk iphoneos PackageApplication -v ./Foobler.app -o ./Foobler-10-20.ipa

```

```
/usr/bin/xcrun -sdk iphoneos PackageApplication -v "${RELEASE_BUILDDIR}/${APPLICATION_NAME}.app" -o "${BUILD_HISTORY_DIR}/${APPLICATION_NAME}.ipa" --sign "${DEVELOPER_NAME}" --embed "${PROVISONING_PROFILE}”
```
