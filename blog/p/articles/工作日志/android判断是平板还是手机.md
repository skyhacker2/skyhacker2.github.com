#Android判断是平板还是手机

文件结构如下：

```
res
	|values
		|settings.xml	
	|values-large
		|settings.xml
```

在res/values/settings.xml里面加入

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <bool name="isTablet">false</bool>
</resources>
```

在res/values-large/settings.xml加入

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <bool name="isTablet">true</bool>
</resources>
```

在代码里面判断：

```
if (getResources().getBoolean(R.bool.isTablet)) {
    // dosomething;
}
```