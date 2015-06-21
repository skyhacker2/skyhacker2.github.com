#C可变参数

```
void error(const char* format, ... )
{
    va_list args;
    va_start(args, format);
    char buff[1024];
    vsnprintf(buff, 1024-3, format, args);
    strcat(buff, "\n");
    fprintf(stderr, "%s", buff);
    //fprintf(stderr, format, args);
    va_end(args);
}
```