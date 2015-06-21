#Cocos2d-x 3.1 Director ActionManger Scheduler

##Director游戏主循环显示Node
###DisplayLinkDirector继承Director
override了以下方法

```
 	virtual void mainLoop() override;
    virtual void setAnimationInterval(double value) override;
    virtual void startAnimation() override;
    virtual void stopAnimation() override;

```

`mainLoop()`是游戏主循环，通过`setAnimationInterval`设置主循环每秒的调用次数。

`mainLoop()`的代码：

```
void DisplayLinkDirector::mainLoop()
{
    if (_purgeDirectorInNextLoop)
    {
        _purgeDirectorInNextLoop = false;
        purgeDirector();
    }
    else if (! _invalid)
    {
        drawScene();
     
        // release the objects
        PoolManager::getInstance()->getCurrentPool()->clear();
    }
}

```

在`drawScene()`方法中，会动用scene的`visit`方法。

```
	// draw the scene
    if (_runningScene)
    {
        _runningScene->visit(_renderer, Mat4::IDENTITY, false);
        _eventDispatcher->dispatchEvent(_eventAfterVisit);
    }

```

在`visit`方法中，如果node不可见，直接返回，然后判断Node是否需要变形。

```
	bool dirty = _transformUpdated || parentTransformUpdated;
    if(dirty)
        _modelViewTransform = this->transform(parentTransform);
    _transformUpdated = false;
```
当调用node的setScale()、setPosition()等方法，`_transformUpdated`为`true`。
这就是为什么cocos2d-x中设置了node的属性，node会自动变化。

接着，Node会调用children的`visit`方法。

```
	if(!_children.empty())
    {
        sortAllChildren();
        // draw children zOrder < 0
        for( ; i < _children.size(); i++ )
        {
            auto node = _children.at(i);

            if ( node && node->_localZOrder < 0 )
                node->visit(renderer, _modelViewTransform, dirty);
            else
                break;
        }
        // self draw
        this->draw(renderer, _modelViewTransform, dirty);

        for(auto it=_children.cbegin()+i; it != _children.cend(); ++it)
            (*it)->visit(renderer, _modelViewTransform, dirty);
    }
    else
    {
        this->draw(renderer, _modelViewTransform, dirty);
    }
```

##ActionManager管理动作
Node里面包含一个ActionManager的成员变量`_actionManager`用于管理动作。

ActionManger提供`addAction`等方法来管理动作，调用Node的`runAction()`方法，实际上是调用ActionManager的`addAction`把动作放到ActionManger里，并以`node`为key放到哈希表里。

ActionManager是单例，在Director的`init`函数里，调用_scheduler->scheduleUpdate()：

```
	_actionManager = new ActionManager();
    _scheduler->scheduleUpdate(_actionManager, Scheduler::PRIORITY_SYSTEM, false);
```

Scheduler每一帧都会动用ActionManager的update函数。

在ActionManager的update函数里，遍历所有动作，并调用`action->step(dt)`来设置动作往前一步。

用`action->isDone()`来判断动作时候执行完，如果执行完，就把动作从ActionManager中移除。

##Scheduler调度器
Scheduler用来定时触发回调函数。

Node里面也有一个`Scheduler`的指针`_scheduler`，调用Node的`schedule`等方法其实是调用Scheduler对应的方法，把Node和回调函数添加到Scheduler的链表里。

Scheduler定了了两个优先级，系统优先级和非系统最低优先级。

```
// Priority level reserved for system services.
const int Scheduler::PRIORITY_SYSTEM = INT_MIN;

// Minimum priority level for user scheduling.
const int Scheduler::PRIORITY_NON_SYSTEM_MIN = PRIORITY_SYSTEM + 1;

```
在Scheduler的构造函数看到了作者的注释：

```
// I don't expect to have more than 30 functions to all per frame
```

所有，每一帧不要超过30个定时回调函数。

在Director的`drawScene`函数中会调用scheduler的`update`方法。

```
 	if (! _paused)
    {
        _scheduler->update(_deltaTime);
        _eventDispatcher->dispatchEvent(_eventAfterUpdate);
    }
```
Scheduler的`update`方法相当于Scheduler的main loop。

Scheduler要处理两种`selector`函数，一种是默认的`update(float dt)`，另一种是用户自定义的，有时间间隔或者调用次数的`selector`函数。

Scheduler用链表来存放第一种`selector`，用哈希表存放第二种`selector`。

默认的`update selector`函数每一帧都调用一次，这里主要分析一下用户自定义的`selector`函数。

下面的结构体用来保存一个自定义的`selector`

```
// Hash Element used for "selectors with interval"
typedef struct _hashSelectorEntry
{
    ccArray             *timers;
    void                *target;
    int                 timerIndex;
    Timer               *currentTimer;
    bool                currentTimerSalvaged;
    bool                paused;
    UT_hash_handle      hh;
} tHashTimerEntry;

```

1. timers是定时器数组，target每调用一次schedule，那么timers就会添加一个定时器。
2. target 目标对象指针
3. timerIndex timers的下标
4. currentTimer 目前的timer
5. currentTimerSalvaged 当前的timer是否保留，用来防止timer未完成工作但被删除了。
6. paused 是否暂停
7. hh 哈希表节点

####分析一下Node的schedule函数

```

void Node::schedule(SEL_SCHEDULE selector, float interval, unsigned int repeat, float delay)
{
    CCASSERT( selector, "Argument must be non-nil");
    CCASSERT( interval >=0, "Argument must be positive");

    _scheduler->schedule(selector, this, interval , repeat, delay, !_running);
}

```

####再看看Scheduler对应的schedule方法

```
void Scheduler::schedule(SEL_SCHEDULE selector, Ref *target, float interval, unsigned int repeat, float delay, bool paused)
{
    CCASSERT(target, "Argument target must be non-nullptr");
    
    tHashTimerEntry *element = nullptr;
    HASH_FIND_PTR(_hashForTimers, &target, element);
    
    if (! element)
    {
        element = (tHashTimerEntry *)calloc(sizeof(*element), 1);
        element->target = target;
        
        HASH_ADD_PTR(_hashForTimers, target, element);
        
        // Is this the 1st element ? Then set the pause level to all the selectors of this target
        element->paused = paused;
    }
    else
    {
        CCASSERT(element->paused == paused, "");
    }
    
    if (element->timers == nullptr)
    {
        element->timers = ccArrayNew(10);
    }
    else
    {
        for (int i = 0; i < element->timers->num; ++i)
        {
            TimerTargetSelector *timer = static_cast<TimerTargetSelector*>(element->timers->arr[i]);
            
            if (selector == timer->getSelector())
            {
                CCLOG("CCScheduler#scheduleSelector. Selector already scheduled. Updating interval from: %.4f to %.4f", timer->getInterval(), interval);
                timer->setInterval(interval);
                return;
            }
        }
        ccArrayEnsureExtraCapacity(element->timers, 1);
    }
    
    TimerTargetSelector *timer = new TimerTargetSelector();
    timer->initWithSelector(this, selector, target, interval, repeat, delay);
    ccArrayAppendObject(element->timers, timer);
    timer->release();
}


```

1、从哈希表中以`target`为`key`查找，如果没有占到对应的`value`，就创建一个`tHashTimerEntry`对象，然后添加到哈希表中。

2、如果element的timers数组为空，就分配10个空间给timers。跳到4。

3、如果element的timers数组不为空，遍历timer数组，判断是否已经存在，如果`selector`已存在，跳到5。

4、新建一个TimerTargetSelector对象，添加到`timers`数组里面。

5、结束。

PS：这里暂时不分析这个TimerTargetSelector类。

####最后就是看Scheduler的update函数了。
这里只关注自定义`selector`的部分代码。

```
// main loop
void Scheduler::update(float dt)
{
    // Iterate over all the custom selectors
    for (tHashTimerEntry *elt = _hashForTimers; elt != nullptr; )
    {
        _currentTarget = elt;
        _currentTargetSalvaged = false;

        if (! _currentTarget->paused)
        {
            // The 'timers' array may change while inside this loop
            for (elt->timerIndex = 0; elt->timerIndex < elt->timers->num; ++(elt->timerIndex))
            {
                elt->currentTimer = (Timer*)(elt->timers->arr[elt->timerIndex]);
                elt->currentTimerSalvaged = false;

                elt->currentTimer->update(dt);

                if (elt->currentTimerSalvaged)
                {
                    // The currentTimer told the remove itself. To prevent the timer from
                    // accidentally deallocating itself before finishing its step, we retained
                    // it. Now that step is done, it's safe to release it.
                    elt->currentTimer->release();
                }

                elt->currentTimer = nullptr;
            }
        }

        // elt, at this moment, is still valid
        // so it is safe to ask this here (issue #490)
        elt = (tHashTimerEntry *)elt->hh.next;

        // only delete currentTarget if no actions were scheduled during the cycle (issue #481)
        if (_currentTargetSalvaged && _currentTarget->timers->num == 0)
        {
            removeHashElement(_currentTarget);
        }
    }
}
```

遍历`_hashForTimers`哈希表。然后依次调用timer的`update`方法。在timer的update方法中，会累加dt，如果累加的时间大于之前设置的`interval`，那么就触发设置的`selector`方法。

```

void Timer::update(float dt)
{
// 省略
		if (_runForever && !_useDelay)
        {//standard timer usage
            _elapsed += dt;
            if (_elapsed >= _interval)
            {
                trigger();

                _elapsed = 0;
            }
        }    

// 省略
}
```

####trigger函数

```
void TimerTargetSelector::trigger()
{
    if (_target && _selector)
    {
        (_target->*_selector)(_elapsed);
    }
}
```

一个自定义schedule的流程就是这样。

####最后总结一下

Cocos2d-x引擎是单线程的，Director类的`mainLoop`是游戏的主循环函数，每次循环，都会调用scene的`visit`函数去显示或者更新界面上的元素。

Scheduler类是Cocos2d-x的调度类，用来定时触发回调函数，回调函数有默认的update`selector`函数和用户自定义的`selector`函数，`mainLoop`中会调用Scheduler的`update`函数，然后Scheduler再去调用其他的`selector`函数。

ActionManager类是管理游戏中全部的动作。ActionManger是依赖Scheduler来进行动作的更新。