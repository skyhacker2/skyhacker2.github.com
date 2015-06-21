#ListView addHeaderView导致item位置不对

当LisetView加了headerView后，点击list第一项在

```
public void onItemClick(AdapterView<?> parent, View view, int position,
					long id)
```

方法中的position是等于1的。

因为headerview的pos是0.所以如果在onItemClick里面用position和自己保存的数据来处理就会不对了。

这个方法传了parent进来是有原因的。

通过parent的getAdapter().getItem(position)就能取得正确的元素了。

当listview有headerview的时候，getAdapter()会返回一个[HeaderViewListAdapter](http://developer.android.com/reference/android/widget/HeaderViewListAdapter.html)

这个Adapter其实是包装了我们一开始传进去的adapter。能够返回正确的listview item。
