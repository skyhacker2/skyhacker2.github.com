#Android ListviewAdapter getView setSelected不起作用

ListView源码还没有空看。

临时解决办法是：

```
if (selected){
    holder.deviceName.setSelected(true);
    holder.stateText.setSelected(true);
    holder.imageView.setSelected(true);
    holder.imageView2.setSelected(true);
    convertView.setBackgroundResource(R.drawable.scan_btn_bg);
} else {
    holder.deviceName.setSelected(false);
    holder.stateText.setSelected(false);
    holder.imageView.setSelected(false);
    holder.imageView2.setSelected(false);
    convertView.setBackgroundResource(R.drawable.selector_device_item);
}
```
