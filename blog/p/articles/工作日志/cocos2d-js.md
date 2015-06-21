#cocos2d-js

## 错误
```
Uncaught TypeError: Cannot read property 'mat' of null
cc.kmMat4Assign	mat4.js:306
_p.visit	BaseNodesWebGL.js:68
_p.visit	BaseNodesWebGL.js:92
cc.Director.cc.Class.extend.drawScene	CCDirector.js:236
cc.DisplayLinkDirector.cc.Director.extend.mainLoop	CCDirector.js:869
callback	CCBoot.js:2005
```

原因：在ctor中没有调用_super()

```
ctor: ()->
	@_super()
	@init()
```