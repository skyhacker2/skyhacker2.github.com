#iOS ViewController dismiss后传回数据

有时候当一个viewcontroller dismiss后需要把数据传回到上一个viewcontroller，可以使用代理模式。

ColorPickerController.h

```
@protocol ColorPickerControllerDelegate <NSObject>
- (void) colorPicked:(UIColor*) color;
@end

@interface ColorPickerController : UIViewController
@property (nonatomic, assign) id<ColorPickerControllerDelegate> delegate;

@end
```

ColorPickerController.m

```
- (IBAction)onSave:(UIBarButtonItem *)sender
{
    if ([self.delegate respondsToSelector:@selector(colorPicked:)]) {
        [self.delegate colorPicked:self.colorWheel.color];
    }
    [self dismissViewControllerAnimated:YES completion:nil];
}
```
