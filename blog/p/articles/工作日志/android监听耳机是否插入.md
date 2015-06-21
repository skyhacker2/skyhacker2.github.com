#Android监听耳机是否插入

Android系统中，当插入耳机或者拔出耳机，会发出一个广播。

这个广播必须是在代码里面注册Receiver才有效，在xml中添加intentfilter没效。

```
private static BroadcastReceiver mHeadSetReceiver =  new BroadcastReceiver() {

	@Override
	public void onReceive(Context context, Intent intent) {
		if (intent.getAction().equals(Intent.ACTION_HEADSET_PLUG)) {
			int state = intent.getIntExtra("state", -1);
			switch (state) {
			case 0:
				mIsHeadSetPlugged = false;
				break;
			case 1:
				mIsHeadSetPlugged = true;
				break;
			default:
				Log.d(TAG, "未知状态");
				break;
			}
			
		}
	}
	
};

public void onResume() {
	IntentFilter filter = new IntentFilter();
	filter.addAction(Intent.ACTION_HEADSET_PLUG);
	mContext.registerReceiver(mHeadSetReceiver, filter);
}

```
