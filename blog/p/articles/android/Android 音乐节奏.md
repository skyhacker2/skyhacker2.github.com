# Android 音乐节奏

最近在做一款音乐灯的app，灯光需要根据音乐节奏来变化。把这几天的研究整理一下。

## 用Visualizer获取节奏数据

首先需要设置Visualizer的CaptureSize，就是将会在`onWaveFormDataCapture`和`onFftDataCapture`传入的byte数组数据长度。

```
mVisualizer = new Visualizer(mMediaPlayer.getAudioSessionId());
mVisualizer.setCaptureSize(Visualizer.getMaxCaptureRate());
```

CaptureSize必须是2的幂，我试过好像只有这个`Visualizer.getMaxCaptureRate()`起作用很快，如果设置一个其他的数据，捕获到数据的时间间隔会比较长。

接着设置`DataCaptureListener`

```
mVisualizer.setDataCaptureListener(mOnDataCaptureListener, Visualizer.getMaxCaptureRate()/2, true, true);
mVisualizer.setEnabled(true);
```

当capture到数据，Listener的`onWaveFormDataCapture`和`onFftDataCapture`就会被调用。

`onWaveFormDataCapture`收到的是波形数据，是无符号byte型，中间值是128.

这里主要用到这个来控制灯的亮度。

当拿到这个数据后，进行以下的计算

```
for (int i = 0; i < wave.length; i++) {
    sum += Math.abs(((wave[i] & 0xff) - 128.0f));
}
sum = sum / wave.length;
hsv[2]= sum / 128.0f;
```

hsv[2]是颜色的亮度值，0-1

## 随机产生颜色

灯光根据节奏变化的时候不想有白光，这里要随机生成的颜色最好不要有较白的颜色。

为了生成这样的颜色，需要用到HSV颜色模型。

H代表色调，取值逆时针从0到360度，0度是红色，120度是绿色，240度是蓝色。

S代表饱和度，可以看成是某种光谱色与白色混合的结果，0%-100%，白色成分为0，饱和度最高，所以这样要取100.

V亮度，0-100，100代表亮度最高

android里面的hsv数组取值是

hsv[0] 0 - 360

hsv[1] 0 - 1

hsv[2] 0 - 1

随机产生颜色的代码：

```
Random random = new Random();
float hsv[] = new float[3];
hsv[0] = random.nextFloat() * 360;
hsv[1]= 1f;
hsv[2] = 1;
```
