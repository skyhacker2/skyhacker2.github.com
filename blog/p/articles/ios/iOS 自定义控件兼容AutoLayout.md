#iOS 自定义控件兼容AutoLayout

练习做一个自定义控件。需要支持3种布局方式

1. Interface Builder
2. initWithFrame
3. init 加 AutoLayout

自定义控件是评分控件`StarSlider`，有五颗星星。

##设计
在View中放下5个ImageView。每一个ImageView的间距是一样的，这需要知道View的Size。

如果通过initWithFrame初始化的话，马上就能知道size了。但是用AutoLayout后size在初始化的时候是不确定的。

`layoutSubviews`方法调用的时候，size已经确定了，我在这个方法里面更新ImageView的位置。而且`layoutSubviews`也会在`initWithFrame`后触发。

效果图：

![image](./img/C73DFDA4-5B08-48C7-B14D-161EFC126723.png)

[Source Code](https://github.com/skyhacker2/StarSlider)
