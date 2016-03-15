# 通过AVFoundation添加摄像头图像到cocos2dx

在上一篇文章[在Cocos2d-X加入摄像头做背景](在Cocos2d-X加入摄像头做背景.md)用UIImagePickerController来做cocos2dx的游戏背景，但是这样做不能动态分析摄像头的图像，这次通过更底层的AVFoundation来实现这个功能，接着下一遍文章会介绍怎样识别人脸。

首先要添加3个framework到项目里面。

1. CoreMedir.framework
2. CoreVideo.framework
3. AVFoundation.framework


在`AppController.mm`添加一个`UIView`和`UIImageView`

```
@property (nonatomic, strong) UIView* cameraView;
@property (nonatomic, strong) UIImageView* imageView;   // 用来显示摄像头图像
```

在`didFinishLaunchingWithOptions`方法里面添加

```
glClearColor(0.0, 0.0, 0.0, 0.0);

_cameraView = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
_cameraView.opaque = NO;
_cameraView.backgroundColor = [UIColor clearColor];
[window addSubview:_cameraView];

_imageView = [[UIImageView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
_imageView.contentMode = UIViewContentModeScaleAspectFill;
[_cameraView addSubview:_imageView];
[self setupCaptureSession];

```

添加一个`setupCaptureSession`方法

```

- (AVCaptureDevice*) frontFacingCameraIfAvailable
{
    NSArray* videoDevices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    AVCaptureDevice* captureDevcie = nil;
    for (AVCaptureDevice* device in videoDevices) {
        if (device.position == AVCaptureDevicePositionFront) {
            captureDevcie = device;
            break;
        }
    }

    if (!captureDevcie) {
        captureDevcie = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    }

    return captureDevcie;
}

- (void) setupCaptureSession
{
    NSError* error = nil;
    _session = [[AVCaptureSession alloc] init];
    _session.sessionPreset = AVCaptureSessionPresetMedium;

    AVCaptureDevice* device = [self frontFacingCameraIfAvailable];
    AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:device error:&error];
    if (!input) {
        NSLog(@"Some kind of error... handle it here");
    }
    [_session addInput:input];

    AVCaptureVideoDataOutput* output = [[AVCaptureVideoDataOutput alloc] init];

    dispatch_queue_t queue = dispatch_queue_create("pumpkins", NULL);
    [output setSampleBufferDelegate:self queue:queue];
    dispatch_release(queue);

    output.videoSettings = [NSDictionary dictionaryWithObject:[NSNumber numberWithInt:kCVPixelFormatType_32BGRA] forKey:(id)kCVPixelBufferPixelFormatTypeKey];

    [_session addOutput:output];

    [_session startRunning];

}
```

AVCaptureSession用来协调数据流的输入和输出，输入当然就是摄像头咯，然后输入会有一个`AVCaptureVideoDataOutput`对象来接收数据。

输入AVCaptureDevice选择前置摄像头。

output.videoSettings设置输入的数据格式是`kCVPixelFormatType_32BGRA`

下面代码当拿到sample数据后然后转换成UIImage，然后设置到UIImageView里面。

```
- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection
{
    UIImage *image = [self imageFromSampleBuffer:sampleBuffer];
    dispatch_sync(dispatch_get_main_queue(), ^{
        [self setImageToView:image];
    });
}

- (UIImage *) imageFromSampleBuffer:(CMSampleBufferRef) sampleBuffer
{
    // Get a CMSampleBuffer's Core Video image buffer for the media data
    CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
    // Lock the base address of the pixel buffer
    CVPixelBufferLockBaseAddress(imageBuffer, 0);

    // Get the number of bytes per row for the pixel buffer
    void *baseAddress = CVPixelBufferGetBaseAddress(imageBuffer);

    // Get the number of bytes per row for the pixel buffer
    size_t bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer);
    // Get the pixel buffer width and height
    size_t width = CVPixelBufferGetWidth(imageBuffer);
    size_t height = CVPixelBufferGetHeight(imageBuffer);
//    NSLog(@"width: %d", width);
//    NSLog(@"height: %d", height);

    // Create a device-dependent RGB color space
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();

    // Create a bitmap graphics context with the sample buffer data
    CGContextRef context = CGBitmapContextCreate(baseAddress, width, height, 8,
                                                 bytesPerRow, colorSpace, kCGBitmapByteOrder32Little | kCGImageAlphaPremultipliedFirst);
    // Create a Quartz image from the pixel data in the bitmap graphics context
    CGImageRef quartzImage = CGBitmapContextCreateImage(context);
    // Unlock the pixel buffer
    CVPixelBufferUnlockBaseAddress(imageBuffer,0);

    // Free up the context and color space
    CGContextRelease(context);
    CGColorSpaceRelease(colorSpace);

    // Create an image object from the Quartz image
    UIImage *image = [UIImage imageWithCGImage:quartzImage];


    // Release the Quartz image
    CGImageRelease(quartzImage);

    return (image);
}

-(void)setImageToView:(UIImage*)image {
    //UIImage * capturedImage = [self rotateImage:image orientation:UIImageOrientationRight ];
    UIImage * capturedImage = [self rotateImage:image orientation:UIImageOrientationLeftMirrored ];
    _imageView.image = capturedImage;
    isPlaying = YES;
    if (isPlaying) {
        //NSLog(@"Playing. Send to Pumpkin layer");
        UIImage * image = _imageView.image;
        if(image!=nil){
            UIInterfaceOrientation orient =  [UIApplication sharedApplication].statusBarOrientation;
            UIImage * rotatedImage = image;
            switch (orient) {
                case UIInterfaceOrientationPortrait:
                    NSLog(@"Device orientation portrait");
                    rotatedImage = [self rotateImage:image orientation: UIImageOrientationRight];
                    break;
                case UIInterfaceOrientationPortraitUpsideDown:
                    rotatedImage = [self rotateImage:image orientation: UIImageOrientationLeft];
                    NSLog(@"Device orientation portrait upside down");
                    break;
                case UIInterfaceOrientationLandscapeLeft:
                    rotatedImage = [self rotateImage:image orientation: UIImageOrientationRight];
                    NSLog(@"Device orientation landscape left");
                    break;
                case UIInterfaceOrientationLandscapeRight:
                    rotatedImage = [self rotateImage:image orientation: UIImageOrientationLeft];
//                        NSLog(@"Device orientation landscape right");
                    _imageView.image = rotatedImage;
                    break;
            };
        }
    }
}
```
