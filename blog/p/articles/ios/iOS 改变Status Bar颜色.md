#iOS 改变Status Bar颜色

1. 修改Info.plist文件， 加入`View controller-based status bar appearance` = `NO`

2. [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
