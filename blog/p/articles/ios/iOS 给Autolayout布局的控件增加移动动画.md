#iOS 给Autolayout布局的控件增加移动动画

```
contentView.swithRightConstraint.constant = 20;
[UIView animateWithDuration:0.2
                 animations:^{
                     contentView.swithcBtn.alpha = 0;
                     [contentView layoutIfNeeded];
                 }];
```
