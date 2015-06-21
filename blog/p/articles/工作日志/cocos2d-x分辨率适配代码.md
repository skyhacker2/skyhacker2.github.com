#cocos2d-x分辨率适配代码

```

CCSize screenSize = CCEGLView::sharedOpenGLView()->getFrameSize();
    
CCSize designSize = CCSizeMake(320, 480);
    
CCFileUtils *pFileUtils = CCFileUtils::sharedFileUtils();
    
std::vector<std::string> searchPaths;
// 判断是否retina屏幕
if (screenSize.height >  480)
{
    CCSize resourceSize = CCSizeMake(640, 960);
    searchPaths.push_back("hd");
    // 把场景放大2倍
    pDirector->setContentScaleFactor(resourceSize.height / designSize.height);
}
    
pFileUtils->setSearchPaths(searchPaths);
    
CCEGLView::sharedOpenGLView()->setDesignResolutionSize(designSize.width, designSize.height, kResolutionShowAll);

```