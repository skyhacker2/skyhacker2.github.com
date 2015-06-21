#cocos2d-x box2d使用调试绘图

##2.2

复制TestCpp的GLES-Render.h和GLES-Render.cpp过来。

添加一个成员变量：

```
GLESDebugDraw *m_debugDraw;
```

初始化物理引擎的时候：

```
void HNGameLayer::initPhysics()
{
    m_debugDraw = new GLESDebugDraw(RATIO);
    uint32 flags = 0;
    flags += b2Draw::e_shapeBit;
    flags += b2Draw::e_jointBit;
    flags += b2Draw::e_aabbBit;
    flags += b2Draw::e_pairBit;
    flags += b2Draw::e_centerOfMassBit;
    m_debugDraw->SetFlags(flags);
    m_b2World = new b2World(b2Vec2(0, -10));
    m_b2World->SetAllowSleeping(true);          // 允许物体进入休眠状态
    m_b2World->SetContinuousPhysics(true);      // 使用连续物理碰撞检测
    m_b2World->SetDebugDraw(m_debugDraw);
    
    ....其他代码
}
```

重写draw函数

```
void HNGameLayer::draw()
{
    CCLayer::draw();
    if (!m_bDebug) {
        return;
    }
    ccGLEnableVertexAttribs( kCCVertexAttribFlag_Position );
    
    kmGLPushMatrix();
    
    m_b2World->DrawDebugData();
    
    kmGLPopMatrix();
    
    CHECK_GL_ERROR_DEBUG();
}
```

防止被背景阻挡了。因为draw函数话出来的东西的z-order应该是0，把背景的z-order设成负数就可以了

##3.1
从cpp-tests复制GLES-Render.h和GLES-Render.cpp过来。

1.添加两个个成员变量：

```
GLESDebugDraw *m_debugDraw;
cocos2d::CustomCommand m_customCmd;
```

2.初始化物理引擎的时候：

```
void HNGameLayer::initPhysics()
{
    m_debugDraw = new GLESDebugDraw(RATIO);
    uint32 flags = 0;
    flags += b2Draw::e_shapeBit;
    flags += b2Draw::e_jointBit;
    flags += b2Draw::e_aabbBit;
    flags += b2Draw::e_pairBit;
    flags += b2Draw::e_centerOfMassBit;
    m_debugDraw->SetFlags(flags);
    m_b2World = new b2World(b2Vec2(0, -10));
    m_b2World->SetAllowSleeping(true);          // 允许物体进入休眠状态
    m_b2World->SetContinuousPhysics(true);      // 使用连续物理碰撞检测
    m_b2World->SetDebugDraw(m_debugDraw);
    
    ....其他代码
}
```

3.重写draw()函数

```
void HNFoodThrowLayer::draw(Renderer *renderer, const Mat4 &transform, bool transformUpdated)
{
    Layer::draw(renderer, transform, transformUpdated);
    
    m_customCmd.init(_globalZOrder);
    m_customCmd.func = CC_CALLBACK_0(HNFoodThrowLayer::onDraw, this, transform, transformUpdated);
    renderer->addCommand(&m_customCmd);
}

```
4.添加onDraw函数

```
void HNFoodThrowLayer::onDraw(const Mat4 &transform, bool transformUpdated)
{
    if (m_isStartPhysicalWorld) {
        
        Director* director = Director::getInstance();
        CCASSERT(nullptr != director, "Director is null when seting matrix stack");
        director->pushMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
        director->loadMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW, transform);
        
        GL::enableVertexAttribs( cocos2d::GL::VERTEX_ATTRIB_FLAG_POSITION );
        m_world->DrawDebugData();
        CHECK_GL_ERROR_DEBUG();
        
        director->popMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
    }
}
```
