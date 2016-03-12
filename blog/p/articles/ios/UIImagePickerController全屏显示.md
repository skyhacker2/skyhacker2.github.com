# UIImagePickerController全屏显示

```
CGSize screenBounds = [UIScreen mainScreen].bounds.size;
CGFloat cameraAspectRatio = 4.0f/3.0f;
CGFloat camViewHeight = screenBounds.width * cameraAspectRatio;
CGFloat scale = screenBounds.height / camViewHeight;
UIImagePickerController* imagePicker = [[UIImagePickerController alloc] init];
imagePicker.cameraViewTransform = CGAffineTransformMakeTranslation(0, (screenBounds.height - camViewHeight) / 2.0);
imagePicker.cameraViewTransform = CGAffineTransformScale(imagePicker.cameraViewTransform, scale, scale);
```
