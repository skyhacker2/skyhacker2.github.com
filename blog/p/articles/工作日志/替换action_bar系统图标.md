#替换Action bar系统图标

##替换Overflow图标

新建一个style

```
<style name="OverFlow" parent="android:Widget.ActionButton.Overflow">
    <item name="android:src">@drawable/ic_more_vert_white_24dp</item>
</style>
```

然后在AppTheme里加上：

```
<style name="AppTheme" parent="android:Theme.Holo.Light.DarkActionBar">
    <item name="android:actionOverflowButtonStyle">@style/OverFlow</item>    
</style>
```

##替换SearchView图标

SearchView的图标需要在代码里面修改


```
final SearchView searchView = (SearchView)menu.findItem(R.id.options_menu_search).getActionView();
int searchImgId = getResources().getIdentifier("android:id/search_button", null, null);
ImageView v = (ImageView) searchView.findViewById(searchImgId);
v.setImageResource(R.drawable.ic_search_white_24dp);
```
