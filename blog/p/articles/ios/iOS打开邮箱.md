#iOS打开邮件程序发邮件

```
NSString *recipients = @"mailto:first@example.com?&subject=Foobler Feedback!";

NSString *body = @"&body=";

NSString *email = [NSString stringWithFormat:@"%@%@", recipients, body];

email = [email stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];

[[UIApplication sharedApplication] openURL:[NSURL URLWithString:email]];
```
