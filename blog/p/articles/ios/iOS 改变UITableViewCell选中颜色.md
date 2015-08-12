#iOS 改变UITableViewCell选中颜色

在自定义的UITableViewCell类里面

```
#define SELECTED_COLOR [UIColor colorWithString:@"#000a23"]
- (void) awakeFromNib
{
    UIView *backgroundView = [[UIView alloc] init];
    backgroundView.backgroundColor = SELECTED_COLOR;
    self.selectedBackgroundView = backgroundView;
}
```
