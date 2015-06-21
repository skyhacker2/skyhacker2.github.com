#Cocos2d-x C++事件处理回调lua

##Layer

```
int Layer::executeScriptTouchHandler(EventTouch::EventCode eventType, Touch* touch, Event* event)
{
#if CC_ENABLE_SCRIPT_BINDING
    if (kScriptTypeLua == _scriptType)
    {
        TouchScriptData data(eventType, this, touch, event);
        ScriptEvent scriptEvent(kTouchEvent, &data);
        return ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
    }
#endif
    //can not reach it
    return 0;
}

int Layer::executeScriptTouchesHandler(EventTouch::EventCode eventType, const std::vector<Touch*>& touches, Event* event)
{
#if CC_ENABLE_SCRIPT_BINDING
    if (kScriptTypeLua == _scriptType)
    {
        TouchesScriptData data(eventType, this, touches, event);
        ScriptEvent scriptEvent(kTouchesEvent, &data);
        return ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
    }
#endif
    return 0;
}

```

##TouchScriptData
```
struct TouchScriptData
{
    EventTouch::EventCode actionType;
    void* nativeObject;
    Touch* touch;
    Event* event;
    
    // Constructor
    /**
     * @js NA
     * @lua NA
     */
    TouchScriptData(EventTouch::EventCode inActionType, void* inNativeObject, Touch* inTouch, Event* evt)
    : actionType(inActionType),
      nativeObject(inNativeObject),
      touch(inTouch),
      event(evt)
    {
    }
};
```