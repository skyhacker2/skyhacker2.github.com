#判断是否是CJK字符

## objective-c

```
#import <Foundation/Foundation.h>

@interface NSString (CJK)

/**
 * 判断是否包含CJK字符，中文，日文和韩文。
 * @return 如果包含返回YES，否则返回NO
 */
- (BOOL) containsCJKCharacters;

@end
```

```
#import "NSString+CJK.h"

@implementation NSString (CJK)

- (BOOL) containsCJKCharacters
{
    if (!self.length) {
        return NO;
    }

    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"[\u2E80-\u9FFF]" options:NSRegularExpressionCaseInsensitive error:nil];
    return ([[regex matchesInString:self options:0 range:NSMakeRange(0, [self length])] count] > 0);
}

@end
```

## Java

```
/**
 * 判断是否含有CJK字符
 * @param string
 * @return
 */
public static boolean containsCJKCharacters(String string)
{
    java.util.regex.Pattern pattern = Pattern.compile("[\\u2E80-\\u9FFF]");
    Matcher matcher = pattern.matcher(string);
    return matcher.find();
}
```
