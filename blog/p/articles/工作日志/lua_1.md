#Lua 1

```
$ lua -i prog //将prog.lua文件内容加载到lua解释器中
```

或在解释器中

```
> dofile('prog.lua')
```

变量名避免是下划线加大写字母，如_VERSION。因为lua中可能有其他用途。

####lua中8种基本类型

```
string, number, function, boolean, nil, userdata, thread, table
```

lua中每一个字符是占8位的。

lua的字符串不可以修改，可以创建一个新的。

```
string.gsub(a, "one", "another")
```

长度运算符`#`

```
a = "abs"
print(#a) ->3
```

**任何数值操作都会把string转换成number**

`tonumber()`和`tostring()`分别可以转换字符串到数字和转换数字到字符串。

`io.read()`读入一行

`a["x"] == a.x`，但`a[0] ~= a["0"]`

`type(nil) ~= nil`，因为两边类型不一样。`type(nil)`是`string`类型，`nil`是`nil`类型。

##求余%的有趣用法

`x%1`是x的小数部分，`x - x%1`是x的整数部分。那么`x - x%0.01`是x保留两位小数。

```
x = math.pi
print(x - x % 0.01)   -->3.14
```

`table`和`userdata`的比较操作比较的是引用。