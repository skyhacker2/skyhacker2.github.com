#Android给ListView加边框

新建一个drawable的xml文件:leftlist_bg.xml

```
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@color/leftlist_item_normal"/>
    <stroke android:width="1px" android:color="@color/split_line"/>
</shape>
```

然后在listview上应用

```
<ListView
    android:id="@+id/left_nav"
    android:layout_width="300dp"
    android:layout_height="match_parent"
    android:paddingRight="1px"
    android:layout_marginBottom="40dp"
    android:background="@drawable/leftlist_bg>
</ListView>
```

注意：`paddingRight="1px"`，如果不设置这个属性的话，listview有item的地方是没有边框的。

item的layout_widht=""match_parent"会盖住边框。所以要paddingRight 1个px。