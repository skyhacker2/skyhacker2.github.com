#iOS 输入法上添加Toolbar和隐藏输入法

##在输入法上添加一个Toolbar
```
UIToolbar* toolbar = [[UIToolbar alloc]initWithFrame:CGRectMake(0, 0, 320, 44)];
toolbar.barStyle = UIBarStyleDefault;
toolbar.items = [NSArray arrayWithObjects:
                       [[UIBarButtonItem alloc]initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:nil action:nil],
                        [[UIBarButtonItem alloc]initWithTitle:@"Done" style:UIBarButtonItemStyleDone target:self action:@selector(inputDone:)],
                       nil];
[toolbar sizeToFit];
textField.inputAccessoryView = toolbar;
```

##隐藏输入法
```
[self.view endEditing:YES];
```
