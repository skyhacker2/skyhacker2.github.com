#C++转型

##C风格的转型动作

```
(T) expression // 将expression转型为T
```

```
T(expression) // 将expression转型为T
```

两种形式并无差别，纯粹是`小括号`的的摆放位置不同而已。

##C++的转型动作

C++提供了四种新式转型(常常被称为new-style或C++-style casts)

1. const_cast<T>(expression)
2. dynamic_cast<T>(expression)
3. reinterpre_cast<T>(expression)
4. static_cast<T>(expression)

各有不同的目的：

`const_cast`通常被用来将对象的常量性转除(cast away the constness)。它也是唯一有此能力的C++ style 转型操作符。

`dynamic_cast`主要用来执行“安全向下转型”(safe downcasting)，也就是用来决定某对象是否归属继承体系中的某个类型。它是唯一无法由C语法转型执行的动作，也是唯一可能耗费重大运行成本的转型动作。

`retinterpret_cast` 意图执行低级转型，实际动作（及结果）可能取决于编译器，这也就代表它不可移植。例如将一个`pointer to int`转型为一个`int`。这一类转型在低级代码以外很少见。

`static_cast`用来强迫隐式转换(implicit conversion)，例如将non-const对象转为const对象，或将int转为double等等。它也可以用来执行上述多种转换的反向转换，例如将void* 指针转为typed指针，将`pointer-to-base`转为`pointer-to-derived`。但它无法将const转为non-const---这个只是`const_cast`才能办得到。