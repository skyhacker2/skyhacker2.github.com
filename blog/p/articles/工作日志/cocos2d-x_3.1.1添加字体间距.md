#cocos2d-x 3.1.1添加字体间距

```
修改添加Label水平间隙
修改CCLabel.h文件
public下添加
void setHSpacing(const int hspacing){_hspacing = hspacing;}
protected下添加
int _hspacing;

修改CCLabel.cpp文件
reset()方法加入
_hspacing = 0;

修改CCLabelTextFormatter.cpp文件
createStringSprites(Label* theLabel)方法中
修改
nextFontPositionX += charAdvance + kernings[i];
为
nextFontPositionX += charAdvance + kernings[i] + theLabel->_hspacing;

```