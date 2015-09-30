#iOS IB_DESIGNABLE/IBInspectable

以前在iOS上面写自定义控件的时候，经常需要运行程序来看效果。

使用这两个宏就可以在Interface Builder里面看到效果和设置属性的值。

用法：
```
#import <UIKit/UIKit.h>

IB_DESIGNABLE @interface ECRangeSlider : UIControl
/// 最小值
@property (assign, nonatomic) IBInspectable float minValue;
/// 最大值
@property (assign, nonatomic) IBInspectable float maxValue;
/// 最小值和最大值之间的距离
@property (assign, nonatomic) IBInspectable float minRange;
/// 较低的值
@property (assign, nonatomic) IBInspectable float lowerValue;
/// 较高的值
@property (assign, nonatomic) IBInspectable float upperValue;
/// Track图片距离两边的距离
@property (assign, nonatomic) IBInspectable float trackPadding;

@property (assign, nonatomic) IBInspectable UIImage* lowerImage;

@property (assign, nonatomic) IBInspectable UIImage* upperImage;

@property (assign, nonatomic) IBInspectable UIImage* trackImage;

@property (readonly, nonatomic) CGPoint lowerCenter;
@property (readonly, nonatomic) CGPoint upperCenter;
@end
```

在Interface Builder里面看到的效果。
![image](./images/ECRanger.png)
