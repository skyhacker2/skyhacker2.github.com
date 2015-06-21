#Cocos2d-js连续播放音频卡顿问题

最近在用Cocos2d-js在做一个小游戏，类似flappy bird那种。

演示地址: [http://flyblock-d0b2f.coding.io/](http://flyblock-d0b2f.coding.io/)

代码地址:[https://coding.net/u/elevenchen/p/FlyBlock/git](https://coding.net/u/elevenchen/p/FlyBlock/git)

每次点击屏幕会播放一个音效，当连续点击好几次后，出现明显的卡帧现象。
从30帧掉到9帧。

查看Cocos2d-js的java的播放音效代码，
在`Cocos2dxSound.java`文件中，找到`doPlayEffect`函数。
加入测试时间的代码：

```
long start = System.currentTimeMillis();
int streamID = this.mSoundPool.play(soundId, this.clamp(leftVolume, 0.0f, 1.0f), this.clamp(rightVolume, 0.0f, 1.0f), Cocos2dxSound.SOUND_PRIORITY, pLoop ? -1 : 0, soundRate);
long end = System.currentTimeMillis();
Log.d("Cocos2dxSound", "play use " + (end - start));

```

得出的结果是:

![image](http://git.oschina.net/nov_eleven/photo/raw/master/cocos2d-js-sound.jpg)

可以看到会出现100ms多的调用时间，这应该是造成画面卡顿的原因了。

还有我发现Android循环播放音效在我的手机小米3上是不起作用，只是播放一次。

经过测试，可以缓解调用延迟的方式有：

1. 在update函数里面，每次播放一个静音的音频文件。

这种方式可以明显减少，但是会出现音效没有播放完被静音音效覆盖了。

2. 起一个新的线程来调用播放函数。

```
class DoPlayEffectThread extends Thread {
   	String mPath;
   	int mSoundID;
   	boolean mLoop;
   	float mPitch;
   	float mPan;
   	float mGain;
   	Cocos2dxSound mContext;
   	
   	public DoPlayEffectThread(Cocos2dxSound context, final String pPath, final int soundId, final boolean pLoop, float pitch, float pan, float gain) {
   		mPath = pPath;
   		mSoundID = soundId;
   		mLoop = pLoop;
   		mPitch = pitch;
   		mPan = pan;
   		mGain = gain;
   		mContext = context;
   	}

	@Override
	public void run() {
		Log.d("DoPlayEffectThread", "run");
		mContext.doPlayEffect(mPath, mSoundID, mLoop, mPitch, mPan, mGain);
	}
   	
};

```

在`playEffect`中调用

```
 public int playEffect(final String pPath, final boolean pLoop, float pitch, float pan, float gain){
        Integer soundID = this.mPathSoundIDMap.get(pPath);
        int streamID = Cocos2dxSound.INVALID_STREAM_ID;

        if (soundID != null) {
            // parameters; pan = -1 for left channel, 1 for right channel, 0 for both channels

            // play sound
            //streamID = this.doPlayEffect(pPath, soundID.intValue(), pLoop, pitch, pan, gain);
            new DoPlayEffectThread(this, pPath, soundID, pLoop, pitch, pan, gain).start();
       }
}

```

这个方法需要牺牲pasueEffect这个功能，因为playEffect这时候不能返回一个soundID，而pauseEffect需要一个soundID作为参赛。还有一个缺点就是连续播放时有时候听起来会不是同步播放的，有延迟。

因为我游戏不用pauseEffect，所以我用第二种方式来解决画面卡顿的问题。总之画面不卡，牺牲一点音效也是没办法了。