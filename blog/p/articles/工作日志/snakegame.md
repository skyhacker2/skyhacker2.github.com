#SnakeGame

##界面
1. 开始界面
2. 关卡界面
3. 地图界面
4. 设置界面（可选）

##设计

###玩法
当蛇的头部在屏幕左边，点击屏幕的方向，蛇的转向是相同的。

当蛇的头部在屏幕右边，点击屏幕的方向，蛇的转向是相反的。

###地图界面
1. 背景图
2. 血条
3. 按钮（可选）
4. 蛇、食物和其他障碍物

分2个layer，一个layer放UI，一个layer放蛇、食物和障碍。

地图设计成X行Y列，多少行多少列通过屏幕宽度、高度和单元格长度算出。

分别用：
m_pSnake, m_pFood, m_pBarrier表示头部、尾部、身体、食物和障碍。

蛇的状态：移动、吃食物、遇到障碍物、吃到自己。

共同的属性：
row、col、sprite、type

食物属性：score、foodType(苹果、士多啤梨)

障碍物属性：

蛇属性：snakeType（头、身、尾巴）、direction、preNode、nextNode

Snake类管理着snake