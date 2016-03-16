# 在cocos2dx中加入人脸识别

![img](./images/face.jpg)

首先加入CoreImage.framework。

主要用到`CIDetector`这个类来做人脸识别。

在上次的代码里面加入一个方法

```
/// 检查人脸
- (void) detectFace:(UIImage*) image
{
    if (!self.detecting) {
        self.detecting = YES;

        NSArray* arr = [self.detector featuresInImage:[CIImage imageWithCGImage:image.CGImage]];

        if ([arr count] > 0) {
//            NSLog(@"Face found.");
            for (int i = 0; i < arr.count; i++) {
                CIFaceFeature* feature = arr[i];
                double xPosition = (feature.leftEyePosition.x + feature.rightEyePosition.x + feature.mouthPosition.x) / (3 * image.size.width);
                double yPosition = (feature.leftEyePosition.y + feature.rightEyePosition.y+feature.mouthPosition.y)/(3*image.size.height);

                double dist = sqrt(pow((feature.leftEyePosition.x - feature.rightEyePosition.x),2)+pow((feature.leftEyePosition.y - feature.rightEyePosition.y),2))/image.size.width;
                yPosition += dist;
                cocos2d::Size size = cocos2d::Director::getInstance()->getWinSize();
                double scale = 4 * (size.width*dist) / 256.0;

                cocos2d::EventDispatcher* eventDispatcher = cocos2d::Director::getInstance()->getEventDispatcher();
                cocos2d::EventCustom event("face data");
                FaceInfo faceInfo = {true, xPosition * size.width, yPosition * size.height, scale};
                event.setUserData(&faceInfo);
                eventDispatcher->dispatchEvent(&event);

            }
        } else {
            cocos2d::EventDispatcher* eventDispatcher = cocos2d::Director::getInstance()->getEventDispatcher();
            cocos2d::EventCustom event("face data");
            FaceInfo faceInfo = {false};
            event.setUserData(&faceInfo);
            eventDispatcher->dispatchEvent(&event);
        }
    }
    self.detecting = NO;
}
```

当检查到人脸后，通过cocos2dx的EventDispatcher发送一个自定义消息出去，收到这个消息的layer会在界面上加上一个南瓜。

```
void ActionLayer::onReceiveFaceInfo(EventCustom* event)
{
    FaceInfo* faceInfo = (FaceInfo*)event->getUserData();
    if (faceInfo->found) {
        _pumpkin->setSpriteFrame(__String::createWithFormat("pumpkin%d.png", _pumpkinCount + 4)->getCString());
        _pumpkin->setScale(faceInfo->scale);
        _pumpkin->setOpacity(255);
        _pumpkin->setPosition(faceInfo->x, faceInfo->y);
    } else {
        _pumpkin->setOpacity(8);
    }

}
```

详细代码看例子，ch2分支。
