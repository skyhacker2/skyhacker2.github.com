#iOS Core Data Failed to create file错误

今天遇到一个神奇的错误，创建sqlite文件的时候错误

```
- (NSURL*) applicationDocumentDirectory
{
    return [[NSFileManager defaultManager] URLsForDirectory:NSDocumentationDirectory inDomains:NSUserDomainMask].lastObject;
}
- (NSPersistentStoreCoordinator*) persistentStoreCoordinator
{
    if (!_persistentStoreCoordinator) {
        _persistentStoreCoordinator = [[NSPersistentStoreCoordinator alloc] initWithManagedObjectModel:self.managedObjectModel];
        NSURL *storeURL = [[self applicationDocumentDirectory] URLByAppendingPathComponent:@"Foobler.sqlite"];
        NSError *error = nil;
        if (![_persistentStoreCoordinator addPersistentStoreWithType:NSSQLiteStoreType configuration:nil URL:storeURL options:nil error:&error]) {
            NSLog(@"%@", [error localizedDescription]);
            abort();
        }

    }
    return _persistentStoreCoordinator;
}
```

原因是路径的问题，用`NSDocumentDirectory`替换`NSDocumentationDirectory`可以解决问题.

区别是`NSDocumentDirectory`是沙盒Documents目录，默认是有的。
`NSDocumentationDirectory`目录默认是没有的，需要创建。
