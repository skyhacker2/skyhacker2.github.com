#Cocos2d-x 时间动作

##简介

####cocos2d-x动作分两种，一种是`即时动作`，另一种`持续动作`。

`即时动作`就是没有延时，马上见效。通常是都是修改CCNode对象的一个属性，例如scale,visable,position等。`即使动作`里面有一个特殊的动作：`函数调用动作`。这个动作是调用一个回调函数，威力强大。

`持续动作`顾名思义就是在一定时间范围内完成的动作。`持续动作`使用得最多了。

##即使动作 CCActionInstant

即时动作的父类是`CCActionInstant`，这里类只是一个抽象的集合，没有具体的动作内容，就是用来分类的。同样延时动作的父类`CCActionInterval`也是一个抽象的集合。

1. ####水平和垂直翻转（CCFlipX和CCFlipY）
2. ####放置（CCPlace）
3. ####隐藏和显示（CCHide和CCShow）
4. ####可见切换（CCToggleVisibility）
5. ####使用和停止网格（CCReuseGrid和CCStopGrid）
6. ####函数调用动作（CCCallFunc、CCCallFuncN、CCCallFuncND和CCCallFuncO）

CCCallFunc是其他三个父类，他们只是传递的参数不一样。


```
static CCCallFunc * create(CCObject* pSelectorTarget, SEL_CallFunc selector);
static CCCallFuncN * create(CCObject* pSelectorTarget, SEL_CallFuncN selector);
static CCCallFuncND * create(CCObject* pSelectorTarget, SEL_CallFuncND selector, void* d);
static CCCallFuncO * create(CCObject* pSelectorTarget, SEL_CallFuncO selector, CCObject* pObject);
```

CCObject.h头文件里的声明：

```
typedef void (CCObject::*SEL_CallFunc)();
typedef void (CCObject::*SEL_CallFuncN)(CCNode*);
typedef void (CCObject::*SEL_CallFuncND)(CCNode*, void*);
typedef void (CCObject::*SEL_CallFuncO)(CCObject*);

#define callfunc_selector(_SELECTOR) (SEL_CallFunc)(&_SELECTOR)
#define callfuncN_selector(_SELECTOR) (SEL_CallFuncN)(&_SELECTOR)
#define callfuncND_selector(_SELECTOR) (SEL_CallFuncND)(&_SELECTOR)
#define callfuncO_selector(_SELECTOR) (SEL_CallFuncO)(&_SELECTOR)

```

可以看出CCCallFunc的回调函数没有参数；CCCallFuncN的回调函数有一个CCNode\*的参数；CCCallFuncND的回调函数有两个参数：CCNode\*和一个void\*参数；CCCallFuncO的回调函数有一个参数CCObject\*。

函数调用动作可以做很多事情，例如sprite执行完动作后可以销毁自己。

##持续动作（CCActionInerval）
###1、与位置相关的持续动作

CCMoveTo、CCMoveBy、CCJumpTo、CCJumpBy、CCBezierTo、CCBezierBy。

看这些动作类的名称就知道是干嘛的了。To和By的区别就是，By有一个reverse()函数，而To没有。这样就可以来回运动了，例如：

```
CCMoveBy *moveBy = CCMoveBy::create(1.0f, ccp(50, 50));
pSprite->runAction(CCSequeue::create(moveBy, movebY->reverse(), NULL));
```

###2、缩放类

CCScaleBy、CCScaleTo

###3、旋转类

CCRotateBy、CCRotateTo

###4、倾斜类

CCSkewTo、CCSkewBy

###5、与颜色相关

CCFadeIn、CCFadeOut、CCFadeTo 淡入淡出效果

CCTintBy、CCTintTo 变色效果

CCBlink 闪烁效果