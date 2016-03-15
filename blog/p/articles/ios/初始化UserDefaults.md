# 初始化UserDefaults

程序第一次启动的时候有时需要设置UserDefaults的默认值，因为取值的时候没有提供默认值。

感觉最好的办法是在`+ (void) initialize`里添加

oc在其他消息前先发送`initialize`消息。

```
+ (void) initialize
{
    NSMutableDictionary* defaultDict = [[NSMutableDictionary alloc] init];
    [defaultDict setObject:@(YES) forKey:@"localRecord"];
    [defaultDict setObject:@(YES) forKey:@"localShot"];
    [[NSUserDefaults standardUserDefaults] registerDefaults:defaultDict];
}
```
