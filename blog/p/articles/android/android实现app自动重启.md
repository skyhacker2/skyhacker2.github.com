# Android实现App自动重启
> 2015
使用PendingIntent和AlarmManager

```
Intent restartIntent = new Intent(MainActivity.this, MainActivity.class);
                    int pendingId = 1;
                    PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this, pendingId, restartIntent, PendingIntent.FLAG_CANCEL_CURRENT);
AlarmManager mgr = (AlarmManager)getSystemService(Context.ALARM_SERVICE);
mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 2000, pendingIntent);
finish();
```