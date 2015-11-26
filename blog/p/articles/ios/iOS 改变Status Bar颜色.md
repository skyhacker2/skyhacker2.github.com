#iOS 改变Status Bar颜色

1. 修改Info.plist文件， 加入`View controller-based status bar appearance` = `NO`

2. [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];

上面是改变字体的颜色。改变背景颜色：

```
UIView *view=[[UIView alloc] initWithFrame:CGRectMake(0, 0,[UIScreen mainScreen].bounds.size.width, 20)];
view.backgroundColor=[UIColor blackColor];
[[UIApplication sharedApplication].keyWindow.rootViewController.view addSubview:view];
```
