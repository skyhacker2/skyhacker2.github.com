#iOS 横屏转竖屏

项目全部界面都是横屏的，只有一个界面是竖屏的，横屏转竖屏在android好方便，但是在iOS上确有点蛋疼。

在controller里面实现以下方法：

```
- (BOOL) shouldAutorotate
{
    return NO;
}

- (UIInterfaceOrientation) preferredInterfaceOrientationForPresentation
{
    return UIInterfaceOrientationPortrait;
}
```

这种方式只能用controller的persentViewController方法跳转，不能直接window.rootViewController替换掉。

代码的布局不能再viewDidLoaded里面加，看打印:

```
viewDidLoaded w: 667.000000 h: 375.000000
updateViewConstraints w: 375.000000 h: 667.000000
viewWillLayoutSubviews w: 375.000000 h: 667.000000
```

viewDidLoaded方法里面的屏幕宽度还是宽屏的，在updateViewConstraints和viewWillLayoutSubviews屏幕宽度才变成竖屏的。