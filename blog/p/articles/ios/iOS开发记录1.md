#iOS开发记录1

##关于TintColor
设置了TintColor的话，那么界面上所有活动的组件的颜色就会跟着改变，也就是说可以实现主题。

参考这篇文章：
[iOS 7 Tutorial Series: Tint Color and Easy App Theming](https://www.captechconsulting.com/blogs/ios-7-tutorial-series-tint-color-and-easy-app-theming)

##扩展UIColor，增加通过字符串来初始化
UIColor+Hex.h
```
@interface UIColor (Hex)

+ (UIColor*) colorWithString: (NSString*) colorString;

+ (UIColor *) colorWithRGBHex: (uint32_t)hex;

@end
```

UIColor+Hex.m
```
#import "UIColor+Hex.h"

@implementation UIColor (Hex)

+ (UIColor*) colorWithString: (NSString*) colorString
{
    NSString *string  = colorString;
    if ([string hasPrefix:@"#"]) {
        string = [string substringFromIndex:1];
    }
    NSScanner *scanner = [NSScanner scannerWithString:string];
    unsigned hexNum;
    if (![scanner scanHexInt:&hexNum]) {
        return nil;
    }
    return [UIColor colorWithRGBHex:hexNum];
}

+ (UIColor *) colorWithRGBHex: (uint32_t)hex
{
    int r = (hex >> 16) & 0xFF;
    int g = (hex >> 8) & 0xFF;
    int b = (hex) & 0xFF;

    return [UIColor colorWithRed:r / 255.0f
                           green:g / 255.0f
                            blue:b / 255.0f
                           alpha:1.0f];
}

@end
```
使用：[UIColor colorWithString:@"#2b565d"]

##改变Tabbaritem的颜色
自定义一个MyTabBarItem类

```
- (void) awakeFromNib
{
    [self setImage:self.image];

    [self setTitleTextAttributes:@{NSForegroundColorAttributeName: [UIColor colorWithString:@"#2b565d"]} forState:UIControlStateNormal];
    [self setTitleTextAttributes:@{NSForegroundColorAttributeName: [UIColor whiteColor]} forState:UIControlStateSelected];
}

- (void) setImage:(UIImage *)image
{
    [super setImage:[image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal]];
    self.selectedImage = [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
}
```

##插入子视图
```
UIImageView *imageView = [[UIImageView alloc] initWithFrame:self.view.bounds];
imageView.image = [UIImage imageNamed:@"bg.png"];
[self.view insertSubview:imageView atIndex:0];

```

##xib自定义视图适配
需要在代码中重新设置frame

##扩展UIView，增加加载xib

UIView+Nib.h
```
@interface UIView (Nib)
+ (id) loadFromNibWithName: (NSString*) name;
@end
```

UIView+Nib.m
```
#import "UIView+Nib.h"

@implementation UIView (Nib)

+ (id) loadFromNibWithName: (NSString*) name
{
    NSArray *nib = [[NSBundle mainBundle] loadNibNamed:name owner:self options:nil];
    if (nib == nil) {
        NSLog(@"%@.xib is not exist", name);
    }
    return [nib objectAtIndex:0];
}

@end

```
