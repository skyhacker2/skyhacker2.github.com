# 编写iOS的ijkplayer插件

主要难点在于怎样把ijkplayer的视频帧转换到unity里显示。

ijkplayer用来显示图像的view是`ijkmedia/ijksdl/ios/IJKSDLGLView`。

首先在同一个文件夹里面新建一个类叫`IJKSDLGLView2`，代码跟IJKSDLView是一样的。

然后添加两个成员变量

```objective-c
@implementation IJKSDLGLView2 {
	// 省略原来的代码
    NSMutableArray* _overlayDatas;
    
    struct SwsContext *img_convert_ctx;
    AVPicture picture;
    BOOL isSetupScaler;
}
```

我们用SwsContext来把yuv420p的视频格式转换成RGB，因为我这里的视频格式只有yuv420p这一种。

_overlayDatas数组用来保存`display`函数里面的`SDL_VoutOverlay`指针

接着增加初始化SwsContext和转换函数

```objective-c
- (void)setupScaler:(SDL_VoutOverlay*) overlay
{

    // Release old picture and scaler
    avpicture_free(&picture);
    sws_freeContext(img_convert_ctx);
    
    // Allocate RGB picture
    avpicture_alloc(&picture, AV_PIX_FMT_RGB24, overlay->w, overlay->h);
    
    // Setup scaler
    static int sws_flags =  SWS_FAST_BILINEAR;
    img_convert_ctx = sws_getContext(overlay->w,
                                     overlay->h,
                                     AV_PIX_FMT_YUV420P,
                                     overlay->w,
                                     overlay->h,
                                     AV_PIX_FMT_RGB24,
                                     sws_flags, NULL, NULL, NULL);
    
}

- (void)convertFrameToRGB:(SDL_VoutOverlay*) overlay
{
    
    int linesize[3] = { overlay->pitches[0], overlay->pitches[1], overlay->pitches[2] };
    
    sws_scale(img_convert_ctx,
              (const uint8_t**)overlay->pixels,
              linesize,
              0,
              overlay->h,
              picture.data,
              picture.linesize);
}
```

在`display`函数里面增加下面的代码

```objective-c
- (void)display: (SDL_VoutOverlay *) overlay
{
	// 省略原来的代码    
    if (overlay != NULL &&  _overlayDatas.count < 1) {
        NSValue* overlayValue = [NSValue valueWithPointer:overlay];
        [_overlayDatas addObject:overlayValue];
    }

    [self unlockGLActive];
}
```

在头文件里面增加一个函数

```objective-c
@property(nonatomic)        BOOL     frameUpdated;
- (GLuint) curTexture;
```

```objective-c
- (BOOL) frameUpdated {
    return [_overlayDatas count] > 0;
}
```

frameUpdated用来判断帧是否有更新

```objective-c
- (GLuint) curTexture
{
    if (_overlayDatas.count > 0) {
        NSValue* pixelValue = [_overlayDatas objectAtIndex:0];
        [_overlayDatas removeObjectAtIndex:0];
        SDL_VoutOverlay* overlay = (SDL_VoutOverlay*)[pixelValue pointerValue];

        if (!isSetupScaler) {
            [self setupScaler:overlay];
            isSetupScaler = YES;
        }
        [self convertFrameToRGB:overlay];
        
        GLuint texture = 0;
        glGenTextures(1, &texture);
        
        GLint curGLTex = 0;
        glGetIntegerv(GL_TEXTURE_BINDING_2D, &curGLTex);
        
        glBindTexture(GL_TEXTURE_2D, texture);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, overlay->w, overlay->h, 0, GL_RGB, GL_UNSIGNED_BYTE, picture.data[0]);
        GLenum glError = glGetError();
        if (GL_NO_ERROR != glError) {
            NSLog(@"glError %x\n", glError);
        }

        return texture;
    }
    
    return 0;
}
```

curTexture函数生成贴图，然后把贴图返回。

修改`IJKFFMoviePlayerController`，把IJKSDLGLView改成IJKSDLGLView2。

并增加两个方法

```objective-c
- (BOOL) frameUpdated;
- (GLuint) curTexture;
```

```objective-c
- (BOOL) frameUpdated
{
    return _glView.frameUpdated;
}
- (GLuint) curTexture
{
    return [_glView curTexture];
}
```

OK! 这时候ijkplayer这边的修改已经完成了。

插件怎样编写参考官方教程咯。

主要是下面两个方法:

```C
bool Native_IsFrameUpdated();
uintptr_t Native_UpdateTexture();
```

其实就是对应ijkplayer增加的两个方法

```c
bool Native_IsFrameUpdated()
{
    return [ijkplayerController isFrameUpdated];
}
uintptr_t Native_UpdateTexture()
{

    uintptr_t ret =  [ijkplayerController curTexture];

	// 删除上次的贴图，不如会爆内存哦
    if (_texId != 0) {
      GLint curGLTex = 0;
      glGetIntegerv(GL_TEXTURE_BINDING_2D, &curGLTex);
      glDeleteTextures(1, &_texId);
      glBindTexture(GL_TEXTURE_2D, curGLTex);
    }
    _texId = ret;

    return ret;


}

```

其他暂停，播放，加载的函数就不写了，都是调用`IJKFFMoviePlayerController`对应的方法

这时候在unity里面看到的图像是180倒过来的，所以要把gameobject倒过来。

```c#
rawImage.gameObject.transform.rotation = Quaternion.Euler (180, 0, 0);
```

Update方法

```c#
void Update()
{
  textureId = Native_UpdateTexture ();
  if (texture == null && textureId != 0) {
      Debug.Log ("create external texture");
      texture = Texture2D.CreateExternalTexture (GetVideoWidth(), GetVideoHeight(), TextureFormat.RGB565, false, false, (IntPtr)textureId);
      texture.wrapMode = TextureWrapMode.Clamp;
      texture.filterMode = FilterMode.Bilinear;
  } else {
      texture.UpdateExternalTexture ((IntPtr)textureId);
  }

  if (GetComponent<RawImage> () != null) {
      GetComponent<RawImage> ().texture = texture;
      GetComponent<RawImage> ().color = Color.white;
  } else {
      GetComponent<Renderer> ().material.mainTexture = texture;
  }
}
```




