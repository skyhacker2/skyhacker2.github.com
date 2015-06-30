#iOS 使用Block Property

定义一个Block别名

```
typedef void (^FinishBlock)();
```

定义一个property

```
@property (copy, nonatomic) FinishBlock finishBlock;
```
