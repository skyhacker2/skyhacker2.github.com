#iOS 升级xcode9后问题

1. CBPeripheral的UUID属性在iOS9上面被删除了。7.0后用identity代替吧。

2. 链接是的bitcode错误，在build settings中搜索bitcode，然后把Yes选为No。
