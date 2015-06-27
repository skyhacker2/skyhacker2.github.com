# 给Android ListView添加删除item动画

给listview删除一个item的时候加上一个折叠动画，感觉效果会好一点。

步骤是当删除一个view，先用动画把view的高度改变，看上去就是折叠的效果。当动画完成的时候，再真正把item移除。

```
    private void deletePattern(final View view, final int position) {

        Animation.AnimationListener al = new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
                mDBHelper.deleteCustomPattern(mPatternList.get(position));
                mPatternList.remove(position);
                mPatternAdapter.notifyDataSetChanged();
            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        };
        collapse(view, al);

    }

    private void collapse(final View view, Animation.AnimationListener al) {
        final int originHeight = view.getMeasuredHeight();

        Animation animation = new Animation() {
            @Override
            protected void applyTransformation(float interpolatedTime, Transformation t) {
                if (interpolatedTime == 1.0f) {
                    view.setVisibility(View.GONE);
                } else {
                    view.getLayoutParams().height = originHeight - (int) (originHeight * interpolatedTime);
                    view.requestLayout();
                }
            }

            @Override
            public boolean willChangeBounds() {
                return true;
            }
        };
        if (al != null) {
            animation.setAnimationListener(al);
        }
        animation.setDuration(300);
        view.startAnimation(animation);
    }
```
![输入图片说明](http://git.oschina.net/nov_eleven/photo/raw/master/listview.gif "在这里输入图片标题")
