#Android eclipse项目转成Android studio项目遇到的问题

##导入到Android studio后发现项目的build.grade是这样的。

```
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.0.0-rc1'
    }
}
```

这是不能编译的，参照官方的说明：
[http://tools.android.com/tech-docs/new-build-system/user-guide](http://tools.android.com/tech-docs/new-build-system/user-guide)

编辑成这样：

```
// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.0.0-rc1'
    }
}
apply plugin: 'android'

dependencies {
    compile fileTree(dir: 'libs', include: '*.jar')
    compile 'com.android.support:appcompat-v7:21.0.+'
    compile project(':libraries:appirater-android')
}

android {
    compileSdkVersion 21
    buildToolsVersion "21.1.1"

    sourceSets {
        main {
            manifest.srcFile 'AndroidManifest.xml'
            java.srcDirs = ['src']
            resources.srcDirs = ['src']
            aidl.srcDirs = ['src']
            renderscript.srcDirs = ['src']
            res.srcDirs = ['res']
            assets.srcDirs = ['assets']
            jniLibs.srcDirs = ['libs']
        }

        // Move the tests to tests/java, tests/res, etc...
        instrumentTest.setRoot('tests')

        // Move the build types to build-types/<type>
        // For instance, build-types/debug/java, build-types/debug/AndroidManifest.xml, ...
        // This moves them out of them default location under src/<type>/... which would
        // conflict with src/ being used by the main source set.
        // Adding new build types or product flavors should be accompanied
        // by a similar customization.
        debug.setRoot('build-types/debug')
        release.setRoot('build-types/release')
    }
}

```
##引入依赖

```
dependencies {
    compile fileTree(dir: 'libs', include: '*.jar')
    compile 'com.android.support:appcompat-v7:21.0.+'
    compile project(':libraries:appirater-android')
}
```
这里依赖项说一下。
第一行是依赖libs文件夹里面的jar文件
第二行是依赖maven库的library
第三行是依赖一个library项目，目录是libraries/appirate-android

##包含so文件

```
jniLibs.srcDirs = ['libs']
```
Android studio默认不会包括libs里面的so文件，如果是so文件，默认是放在main/jniLibs目录里面。因为我的项目是从eclipse转过来的，所以需要手动指定目录。