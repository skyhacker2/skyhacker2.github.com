#Cocos2d-x ListView 白屏问题

今天使用ListView发现Android上图片不见了，显示白色背景和色块。

原因可能是手机不支持Color RGB8888

在AppActivity里override

```

public Cocos2dxGLSurfaceView onCreateView(){
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8); 
        return glSurfaceView;
	} 
```