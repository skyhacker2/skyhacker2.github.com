#iOS 打印自带的字体

```
NSDictionary* infoDict = [[NSBundle mainBundle] infoDictionary];
NSArray* fontFiles = [infoDict objectForKey:@"UIAppFonts"];
for (NSString *fontFile in fontFiles) {
    NSLog(@"file name: %@", fontFile);
    NSURL *url = [[NSBundle mainBundle] URLForResource:fontFile withExtension:NULL];
    NSData *fontData = [NSData dataWithContentsOfURL:url];
    CGDataProviderRef fontDataProvider = CGDataProviderCreateWithCFData((__bridge CFDataRef)fontData);
    CGFontRef loadedFont = CGFontCreateWithDataProvider(fontDataProvider);
    NSString *fullName = CFBridgingRelease(CGFontCopyFullName(loadedFont));
    CGFontRelease(loadedFont);
    CGDataProviderRelease(fontDataProvider);
    NSLog(@"font name: %@", fullName);
}
```
