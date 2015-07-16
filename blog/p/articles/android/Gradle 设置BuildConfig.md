#Gradle 设置BuildConfig

BuildConfig类有一些很有用的常量，例如DEBUG、VERSION_CODE等，可以在进行判断。通过Gradle还可以自定义自己的变量

```
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        buildConfigField 'boolean', 'TEST', 'false'
        buildConfigField 'String', 'API_URL', '"http://www.ihunuo.com/api"'
    }
    debug {
        buildConfigField 'boolean', 'TEST', 'true'
        buildConfigField 'String', 'API_URL', '"http://www.ihunuo.com/test/api"'
    }
}
```

例如release和debug版本中使用不用的API URL。
