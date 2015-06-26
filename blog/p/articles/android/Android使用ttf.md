# Android使用ttf

把ttf文件放到assets目录下面。

然后代码：

```
Typeface typeface = Typeface.createFromAsset(getActivity().getAssets(), "DroidSansFallback.ttf");
Paint textPaint = new Paint();
textPaint.setTypeface(typeface);
```
