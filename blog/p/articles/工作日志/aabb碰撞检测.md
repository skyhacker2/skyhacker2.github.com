#AABB碰撞检测

##算法

将矩形A和矩形B进行X轴和Y轴投影。如果两个坐标轴都有重叠的话，就发生碰撞。

```
typedef struct AABBTag {
    cocos2d::CCPoint pt; // 中间点
    float helfWidth;
    float helfHeight;
} AABB;

```

```
bool aabbTest(AABB &a, AABB &b)
{
    if (abs(a.pt.x - b.pt.x) > (a.helfWidth + b.helfWidth)) {
        return false;
    }
    if (abs(a.pt.y - b.pt.y) > (a.helfHeight + b.helfHeight)) {
        return false;
    }
    return true;
}

```