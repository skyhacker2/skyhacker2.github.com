#iOS使用AudioQueue录音

因为要做离线语音识别，我用了PocketSphinx，需要边录音边获取PCM。

一开始折腾过AudioEngine，但是失败了。

主要是AudioEngine我不知道怎样可以录16000 sample rate的音频。

## 1创建一个AQRecorderState结构体

```
static const int kNumberBuffers = 3;                            
typedef struct AQRecorderState {
    AudioStreamBasicDescription  mDataFormat;
    AudioQueueRef                mQueue;
    AudioQueueBufferRef          mBuffers[kNumberBuffers];
    AudioFileID                  mAudioFile;
    UInt32                       bufferByteSize;
    SInt64                       mCurrentPacket;
    bool                         mIsRunning;
}AQRecorderState;
```

## 2创建一个用来处理PCM数据的回调函数

```
static void HandleInputBuffer (
                               void                                *aqData,
                               AudioQueueRef                       inAQ,
                               AudioQueueBufferRef                 inBuffer,
                               const AudioTimeStamp                *inStartTime,
                               UInt32                              inNumPackets,
                               const AudioStreamPacketDescription  *inPacketDesc
)
{
    SphinxRecorder* recorder = (__bridge SphinxRecorder*)aqData;
    AQRecorderState pAqData = recorder.aqData;
    
    NSLog(@"size %d", inBuffer->mAudioDataByteSize);
    NSData* data = [NSData dataWithBytes:inBuffer->mAudioData length:inBuffer->mAudioDataByteSize];
    
    
    if (recorder.recordBlock) {
        recorder.recordBlock(data);
    }
    
    if (pAqData.mIsRunning == 0) return;
    
    AudioQueueEnqueueBuffer (
                             pAqData.mQueue,
                             inBuffer,
                             0,
                             NULL
                             );
}
```

## 3创建一个计算buffer大小的函数

```
void DeriveBufferSize (
                       AudioQueueRef                audioQueue,
                       AudioStreamBasicDescription  ASBDescription,
                       Float64                      seconds,
                       UInt32                       *outBufferSize
) {
    static const int maxBufferSize = 0x50000;
    
    int maxPacketSize = ASBDescription.mBytesPerPacket;
    if (maxPacketSize == 0) {
        UInt32 maxVBRPacketSize = sizeof(maxPacketSize);
        AudioQueueGetProperty (
                               audioQueue,
                               kAudioQueueProperty_MaximumOutputPacketSize,
                               // in Mac OS X v10.5, instead use
                               //   kAudioConverterPropertyMaximumOutputPacketSize
                               &maxPacketSize,
                               &maxVBRPacketSize
                               );
    }
    
    Float64 numBytesForTime =
    ASBDescription.mSampleRate * maxPacketSize * seconds;
    UInt32 size = (UInt32)( numBytesForTime < maxBufferSize ? numBytesForTime : maxBufferSize);
    *outBufferSize = size;
}
```

## 4配置AQRecorderState

```
aqData.mDataFormat.mFormatID         = kAudioFormatLinearPCM;
aqData.mDataFormat.mSampleRate       = 16000.0;
aqData.mDataFormat.mChannelsPerFrame = 1;
aqData.mDataFormat.mBitsPerChannel   = 16;
aqData.mDataFormat.mBytesPerPacket   =
aqData.mDataFormat.mBytesPerFrame =
aqData.mDataFormat.mChannelsPerFrame * sizeof (SInt16);
aqData.mDataFormat.mFramesPerPacket  = 1;
aqData.mDataFormat.mFormatFlags = kLinearPCMFormatFlagIsSignedInteger | kLinearPCMFormatFlagIsPacked;

// 计算buffer size
DeriveBufferSize (
                  aqData.mQueue,
                  aqData.mDataFormat,
                  0.5,
                  &aqData.bufferByteSize
                  );
```

## 5分配内存和把buffer加入队列

```
for (int i = 0; i < kNumberBuffers; ++i) {
    AudioQueueAllocateBuffer (
                              aqData.mQueue,
                              aqData.bufferByteSize,
                              &aqData.mBuffers[i]
                              );
    
    AudioQueueEnqueueBuffer (
                             aqData.mQueue,
                             aqData.mBuffers[i],
                             0,
                             NULL
                             );
}
```

## 6开始录音

```
aqData.mIsRunning = true;
OSStatus status =  AudioQueueStart (
                 aqData.mQueue,
                 NULL
                 );
NSLog(@"startRecord status %d", status);
```

## 5停止录音

```
//    AudioQueueStop (
//                    aqData.mQueue,
//                    true
//                    );
AudioQueuePause(aqData.mQueue);

aqData.mIsRunning = false;
```

停止录音不用AudioQueueStop，是因为Stop后，不能重新Start，需要重新创建queue，就是4的步骤。

Pause后调Start，系统会调用Resume方法，就可以重复使用了。

## 参考

[Recording Audio](https://developer.apple.com/library/content/documentation/MusicAudio/Conceptual/AudioQueueProgrammingGuide/AQRecord/RecordingAudio.html#//apple_ref/doc/uid/TP40005343-CH4-SW1)
