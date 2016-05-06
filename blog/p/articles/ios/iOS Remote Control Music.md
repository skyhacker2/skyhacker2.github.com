# iOS Remote Control Music

配置Remote Control的信息。

```
- (void)configureNowPlayingInfo:(MPMediaItem*)item
{
    MPNowPlayingInfoCenter* info = [MPNowPlayingInfoCenter defaultCenter];
    NSMutableDictionary* newInfo = [NSMutableDictionary dictionary];
    NSSet* itemProperties = [NSSet setWithObjects:MPMediaItemPropertyTitle,
                             MPMediaItemPropertyArtist,
                             MPMediaItemPropertyPlaybackDuration,
                             MPNowPlayingInfoPropertyElapsedPlaybackTime,
                             nil];
    
    [item enumerateValuesForProperties:itemProperties
                            usingBlock:^(NSString *property, id value, BOOL *stop) {
                                if (value) {
                                    [newInfo setObject:value forKey:property];
                                }
                                
                            }];
    
    info.nowPlayingInfo = newInfo;
}
```

如果不配置，上传app store直接被拒绝了。=。=