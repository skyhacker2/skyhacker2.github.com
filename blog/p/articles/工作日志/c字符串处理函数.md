#C字符串处理函数

>void *memccpy (void *dest, const void *src, int c, size_t n);

从src所指向的对象复制n个字符到dest所指向的对象中。如果复制过程中遇到了字符c则停止复制，返回指针指向dest中字符c的下一个位置；否则返回NULL。

>void *memcpy (void *dest, const void *src, size_t n);

从src所指向的对象复制n个字符到dest所指向的对象中。返回指针为dest的值。

>void *memchr (const void *s, int c, size_t n);

在s所指向的对象的前n个字符中搜索字符c。如果搜索到，返回指针指向字符c第一次出现的位置；否则返回NULL。

>int memcmp (const void *s1, const void *s2, size_t n);

比较s1所指向的对象和s2所指向的对象的前n个字符。返回值是s1与s2第一个不同的字符差值。

>int memicmp (const void *s1, const void *s2, size_t n);

比较s1所指向的对象和s2所指向的对象的前n个字符，忽略大小写。返回值是s1与s2第一个不同的字符差值。

>void *memmove (void *dest, const void *src, size_t n);

从src所指向的对象复制n个字符到dest所指向的对象中。返回指针为dest的值。不会发生内存重叠。

>void *memset (void *s, int c, size_t n);

设置s所指向的对象的前n个字符为字符c。返回指针为s的值。

>char *stpcpy (char *dest, const char *src);

复制字符串src到dest中。返回指针为dest + len(src)的值。

>char *strcpy (char *dest, const char *src);

复制字符串src到dest中。返回指针为dest的值。

>char *strcat (char *dest, const char *src);

将字符串src添加到dest尾部。返回指针为dest的值。

>char *strchr (const char *s, int c);

在字符串s中搜索字符c。如果搜索到，返回指针指向字符c第一次出现的位置；否则返回NULL。

>int strcmp (const char *s1, const char *s2);

比较字符串s1和字符串s2。返回值是s1与s2第一个不同的字符差值。

>int stricmp (const char *s1, const char *s2);

比较字符串s1和字符串s2，忽略大小写。返回值是s1与s2第一个不同的字符差值。

>size_t strcspn (const char *s1, const char *s2);

返回值是字符串s1的完全由不包含在字符串s2中的字符组成的初始串长度。

>size_t strspn (const char *s1, const char *s2);

返回值是字符串s1的完全由包含在字符串s2中的字符组成的初始串长度。

>char *strdup (const char *s);

得到一个字符串s的复制。返回指针指向复制后的字符串的首地址。

>char *strerror(int errnum);

返回指针指向由errnum所关联的出错消息字符串的首地址。errnum的宏定义见errno.h。

>size_t strlen (const char *s);

返回值是字符串s的长度。不包括结束符'/0'。

>char *strlwr (char *s);

将字符串s全部转换成小写。返回指针为s的值。

>char *strupr (char *s);

将字符串s全部转换成大写。返回指针为s的值。

>char *strncat (char *dest, const char *src, size_t maxlen);

将字符串src添加到dest尾部，最多添加maxlen个字符。返回指针为dest的值。

>int strncmp (const char *s1, const char *s2, size_t maxlen);

比较字符串s1和字符串s2，最多比较maxlen个字符。返回值是s1与s2第一个不同的字符差值。

>char *strncpy (char *dest, const char *src, size_t maxlen);

复制字符串src到dest中，最多复制maxlen个字符。返回指针为dest的值。

>int strnicmp(const char *s1, const char *s2, size_t maxlen);

比较字符串s1和字符串s2，忽略大小写，最多比较maxlen个字符。返回值是s1与s2第个不同的字符差值。

>char *strnset (char *s, int ch, size_t n);

设置字符串s中的前n个字符全为字符c。返回指针为s的值。

>char *strset (char *s, int ch);

设置字符串s中的字符全为字符c。返回指针为s的值。

>char *strpbrk (const char *s1, const char *s2);

返回指针指向字符串s1中字符串s2的任意字符第一次出现的位置；如果未出现返回NULL。

>char *strrchr (const char *s, int c);

在字符串s中搜索字符c。如果搜索到，返回指针指向字符c最后一次出现的位置；否则返回NULL。

>char *strrev (char *s);

将字符串全部翻转，返回指针指向翻转后的字符串。

>char *strstr (const char *s1, const char *s2);

在字符串s1中搜索字符串s2。如果搜索到，返回指针指向字符串s2第一次出现的位置；否则返回NULL。

>char *strtok (char *s1, const char *s2);

用字符串s2中的字符做分隔符将字符串s1分割。返回指针指向分割后的字符串。第一次调用后需用NULLL替代s1作为第一个参数。


