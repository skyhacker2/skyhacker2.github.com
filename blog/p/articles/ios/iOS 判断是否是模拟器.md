# iOS 判断是否是模拟器

判断是否是模拟器

```
#if (TARGET_IPHONE_SIMULATOR)
```

是否是真机

```
#if !(TARGET_IPHONE_SIMULATOR)
```

或者是

```
#if (TARGET_OS_IPHONE)
```
