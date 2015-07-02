Example to centre on `cx` and `cy`:
```
private final Rect textBounds = new Rect(); //don't new this up in a draw method

public void drawTextCentred(Canvas canvas, Paint paint, String text, float cx, float cy){
  paint.getTextBounds(text, 0, text.length(), textBounds);
  canvas.drawText(text, cx - textBounds.exactCenterX(), cy - textBounds.exactCenterY(), paint);
}
```
##Reference
[http://stackoverflow.com/questions/4909367/how-to-align-text-vertically](http://stackoverflow.com/questions/4909367/how-to-align-text-vertically)
