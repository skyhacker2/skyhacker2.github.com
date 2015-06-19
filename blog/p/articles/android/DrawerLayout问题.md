#DrawerLayout在onCreate方法里面调用openDrawer问题

DrawerLayout在onCreate方法里面调用`openDrawer()`，并不会触发Listener的`onDrawerOpened()`方法。

openDrawer方法:

```
public void openDrawer(View drawerView) {
    if (!isDrawerView(drawerView)) {
        throw new IllegalArgumentException("View " + drawerView + " is not a sliding drawer");
    }

    if (mFirstLayout) {
        final LayoutParams lp = (LayoutParams) drawerView.getLayoutParams();
        lp.onScreen = 1.f;
        lp.knownOpen = true;

        updateChildrenImportantForAccessibility(drawerView, true);
    } else {
        if (checkDrawerViewAbsoluteGravity(drawerView, Gravity.LEFT)) {
            mLeftDragger.smoothSlideViewTo(drawerView, 0, drawerView.getTop());
        } else {
            mRightDragger.smoothSlideViewTo(drawerView, getWidth() - drawerView.getWidth(),
                    drawerView.getTop());
        }
    }
    invalidate();
}
```

关键是`mFirstLayout`成员变量的值。
`mFirstLayout`一开始是设置为true的，但是在onLayout方法里面会设置为false。但是调用openDrawer()的时候onLayout()还没有被调用。而onDrawerOpend()方法是要在DragCallback里面的onViewDragStateChanged调用的。

解决办法，用handler延时500毫秒openDrawer。

```
// Hack
// 在onCreate方法里面调用mDrawerLayout.openDrawer(Gravity.LEFT);
// 这时候onDrawerOpened方法没有被调用
// 延迟500ms，使界面完全出现的时候再调用。
mHandler.postDelayed(new Runnable() {
    @Override
    public void run() {
        onViewDisplayed();
    }
}, 500);


public void onViewDisplayed() {
    SharedPreferences prefs = getSharedPreferences(SETTING_PREFS, MODE_PRIVATE);
    boolean firstLaunch = prefs.getBoolean("first_launch", true);
    if (firstLaunch) {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean("first_launch", false);
        mDrawerLayout.openDrawer(Gravity.LEFT);
    }
}
```