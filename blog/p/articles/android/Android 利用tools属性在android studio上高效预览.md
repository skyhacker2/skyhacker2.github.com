#Android 利用tools属性在android studio上高效预览

[Android Tools Project Site](http://tools.android.com/tech-docs/tools-attributes)

## 被遗忘的tools namespace

```
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >
    ....
```

`tools:`在界面设计阶段非常有用。我只说几个我决定很爽的用法。其他用法可以在上面的`Android Tools Project Site`找到。

### tools:layout

这个属性用在`fragment`标签上，在设计界面显示。

```
<fragment android:name="com.example.master.ItemListFragment" tools:layout="@android:layout/list_content" />
```

## tools:listitem

这个属性可以使`ListView`，`GridView`在设计阶段显示自定义的`listitem`。

```
<ListView
        android:id="@android:id/list"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:listitem="@layout/custom_list_item" />
```
