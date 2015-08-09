#Android Studio发布library

##参考这里: [使用Gradle发布项目到JCenter仓库](http://zhengxiaopeng.com/2015/02/02/%E4%BD%BF%E7%94%A8Gradle%E5%8F%91%E5%B8%83%E9%A1%B9%E7%9B%AE%E5%88%B0JCenter%E4%BB%93%E5%BA%93/)

##补充
android-maven的错误。org/gradle/api/publication/maven/internal/DefaultMavenFactory

最新版的gradle要用：

`classpath 'com.github.dcendents:android-maven-gradle-plugin:1.3'`
