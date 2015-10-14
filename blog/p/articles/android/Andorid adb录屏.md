#Andorid adb录屏.md

[Android官网](https://developer.android.com/tools/help/shell.html#screenrecord)

为了避免翻墙，抄过来。

The `screenrecord` command is a shell utility for recording the display of devices running Android 4.4 (API level 19) and higher. The utility records screen activity to an MPEG-4 file.

>Note: Audio is not recorded with the video file.

A developer can use this file to create promotional or training videos. While in a shell, the syntax is:

```
screenrecord [options] <filename>
```

To use screenrecord from the command line, type the following:
```
$ adb shell screenrecord /sdcard/demo.mp4
```
Stop the screen recording by pressing Ctrl-C, otherwise the recording stops automatically at three minutes or the time limit set by `--time-limit`.

To begin recording your device screen, run the `screenrecord` command to record the video. Then, run the `pull` command to download the video from the device to the host computer. Here's an example recording session:
```
$ adb shell
shell@ $ screenrecord --verbose /sdcard/demo.mp4
(press Ctrl-C to stop)
shell@ $ exit
$ adb pull /sdcard/demo.mp4
```
The `screenrecord` utility can record at any supported resolution and bit rate you request, while retaining the aspect ratio of the device display. The utility records at the native display resolution and orientation by default, with a maximum length of three minutes.

There are some known limitations of the screenrecord utility that you should be aware of when using it:

1. Some devices may not be able to record at their native display resolution. If you encounter problems with screen recording, try using a lower screen resolution.
2. Rotation of the screen during recording is not supported. If the screen does rotate during recording, some of the screen is cut off in the recording.
Table 4. screenrecord options

Options|	Description
----|---|
--help	|Displays command syntax and options
--size <WIDTHxHEIGHT>	|Sets the video size: 1280x720. The default value is the device's native display resolution (if supported), 1280x720 if not. For best results, use a size supported by your device's Advanced Video Coding (AVC) encoder.
--bit-rate <RATE>	|Sets the video bit rate for the video, in megabits per second. The default value is 4Mbps. You can increase the bit rate to improve video quality, but doing so results in larger movie files. The following example sets the recording bit rate to 6Mbps:`screenrecord --bit-rate 6000000 /sdcard/demo.mp4`
--time-limit <TIME>	|Sets the maximum recording time, in seconds. The default and maximum value is 180 (3 minutes).
--rotate	|Rotates the output 90 degrees. This feature is experimental.
--verbose	|Displays log information on the command-line screen. If you do not set this option, the utility does not display any information while running.
