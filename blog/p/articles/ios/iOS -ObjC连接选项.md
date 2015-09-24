#iOS -ObjC连接选项

今天在接一个库的时候出现一个错误。

意思就是说对象xxx没有xxx这个方法。

库里面的NSArray用了category。

为了解决这个问题，需要在Other linker Flags里面加入`-ObjC`

这个flag是专门处理-ObjC的一个bug的。用了-ObjC以后，如果类库中只有category没有类的时候这些category还是加载不进来。变通方法就是加入-all_load或者-force-load。-all_laod会强制
