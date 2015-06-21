#Android相机使用1

##打开相机

```
Camera camera = null;
try{
	camera = Camera.open();
} catch(Exception e) {
	// 相机打开失败
}
```

直接用Camera.open()方法会打开第一个后置摄像头，如果手机没有后置摄像头的话，就会返回null

用`Camera.open(cameraId)`打开指定的摄像头

通过`Camera.getNumberOfCameras()`可以获取摄像头的个数

打开前摄像头

```
private int getFrontCameraId() {
    CameraInfo ci = new CameraInfo();
    for (int i = 0 ; i < Camera.getNumberOfCameras(); i++) {
        Camera.getCameraInfo(i, ci);
        if (ci.facing == CameraInfo.CAMERA_FACING_FRONT) return i;
    }
    return -1; // No front-facing camera found
}

private Camera openFrontCamera() {
	Camera camera = null;
	int frontId = getFrontCameraId();
	if (frontId != -1) {
		camera = Camera.open(frontId);
		return camera;
	} else {
		return null;
	}

}
```

##设置预览
