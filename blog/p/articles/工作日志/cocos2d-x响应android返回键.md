#cocos2d-x响应Android返回键

在layer中重写

```
virtual void keyBackClicked(void);
```

并且调用

```
setKeypadEnabled(true);
```