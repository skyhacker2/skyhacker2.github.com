#Lua

##8种类型
1. nil
2. boolean
3. number
4. string - 一般是8位字符，如果平台支持，可以支持Unicode
5. function
6. userdata - 有C语言分配并且管理，Lua不能创建或者操作userdata
7. thread
8. table

##系统库
1. table
2. string
3. math
4. file
5. os

##快速排序

```
swap = function ( arr, l, r )
	arr[l], arr[r] = arr[r], arr[l]
end

quicksort = function(arr, l, r)
	if l > r then
		return
	end
	local m = l
	for i = m+1, r do
		if arr[l] > arr[i] then
			m = m+1
			swap(arr, i, m)
		end
	end
	swap(arr, l, m)
	quicksort(arr, l, m-1)
	quicksort(arr, m+1, r)

end

local list = {2, 1, 3, 5}
quicksort(list, 1, #list)
for i = 1, #list do
	print(list[i])
end

```

##迭代器

```
for <var-list> in <expr-list> do
 <body>
end

```
`expr-list`接受3个参数，iterator函数，不变状态变量，控制变量。

```
for var_1, ..., var_n in <explist> do <block> end
```

等于

```
do	local _f, _s, _var = <explist> 	while true do		local var_1, ... , var_n = _f(_s, _var) _var = var_1		if _var == nil then break end		<block>	end
end
```

##Weak Table
`弱引用`的对象引用数不会加一。

设置metatable的`__mode`属性，`k`为key的对象是弱引用，`v`为value的对象是弱引用，`kv`为key和value的对象都是弱引用。

```
a = {}
b = {__mode = "k"}
setmetatable(a, b)
key = {}
a[key]= 1
key = {}
a[key] = 2
collectgarbage()
for k, v in pairs(a) do print(v) end```

```

上面的代码输出的是2，因为第一个`key={}`的对象引用数没有加一，当key指向另一个`{}`时，之前的对象引用数等于0，被回收了。

如果不设置`__mode="k"`，那么输出的结果是1, 2

##Xcode添加lua

1. 添加头文件搜索Build Settings->Search Paths->Header Search Paths添加`/usr/local/include`
2. 添加库文件搜索Build Settings->Search Paths->Library Search Paths添加`/usr/local/lib`
3. 添加连接命令Build Settings->Linking->Other Linker Flags添加`-llua`

##Lua栈
Lua使用使用一个抽象的栈来进行数据交换。在这个栈中，每一个插槽可以保存任何一种lua数据。

任何时候你想获取一个lua的数据，调用lua，把想要获取的数据压入栈中。

任何时候你想传一个数据给lua，把数据压入栈中，然后调用lua，然后弹出数据。

压入数据：

```
void lua_pushnil      (lua_State *L);void lua_pushboolean  (lua_State *L, int bool);void lua_pushnumber   (lua_State *L, lua_Number n);void lua_pushinteger  (lua_State *L, lua_Integer n);void lua_pushunsigned (lua_State *L, lua_Unsigned n);void lua_pushlstring  (lua_State *L, const char *s, size_t len);void lua_pushstring   (lua_State *L, const char *s);
```

## C API

```
lua_State *L = luaL_newstate();
```
lua_State是lua定义的动态结构，所有的函数都有这个lua_State作为参数，这使lua可以用于多线程。

luaL_newstate()创建一个新的Lua state，新的Lua state的环境不包含任何预定义的函数，包括print。

### lua_gettop(lua_State *L)

返回栈顶元素的下标，因为开始是1，所以结果等于栈里的元素个数。

### lua_pushstring(lua_State *L, const char *s)
把字符串s压入栈中

### lua_rawget (lua_State *L, int index)
跟 lua_gettable差不多，不过不访问metatable

### lua_CFunction 指针和pushcfunction(cfunc)

`typedef int (*lua_CFunction) (lua_State *L);`

```
static int l_sin(lua_State *L)
{
	return 1
}
```

return 1表示栈中有1个结果。