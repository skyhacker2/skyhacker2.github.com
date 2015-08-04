#iOS UINavigicationBar透明

```
[self.navigationController.navigationBar setBackgroundImage:[[UIImage alloc] init] forBarMetrics:UIBarMetricsDefault];
self.navigationController.navigationBar.shadowImage = [[UIImage alloc] init];
self.navigationController.navigationBar.translucent = YES;

```
