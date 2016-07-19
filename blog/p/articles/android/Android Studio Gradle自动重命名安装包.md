# Android Studio Gradle自动重命名安装包

在`app.gradle`的`android`标签里面加入：

```
applicationVariants.all { variant ->
    variant.outputs.each { output ->
        output.outputFile = new File(
                output.outputFile.parent,
                "$rootProject.name-v${variant.versionName}-build${variant.versionCode}.apk")
    }
}
```

上面会使生成的安装包名字变成rootprojectname + versionName + versionCode