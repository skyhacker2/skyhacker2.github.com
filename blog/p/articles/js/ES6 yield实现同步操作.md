# ES6 yield实现同步操作

## 第一种 把异步函数封装一层，变成同步调用。

```
function asyncHandle(text) {
    return (callback)=>{
        setTimeout(()=>{
            callback(text);
        }, 100);
    }
}

function co(generate) {
    var iterator = generate();
    function next(result) {
        var state = iterator.next(result);
        if (!state.done) {
            state.value(next);
        }
    }
    next();
}

/**
* 同步操作
*/
function* sync() {
    var a = yield asyncHandle('aaa');
    console.log(a);
    var b = yield asyncHandle('bbb');
    console.log(b);
}
// 执行
co(sync);
```

geneartor的next方法如果有参数，那么会当成yield的返回值返回给a变量。

## 第二种 geneartor自己控制自己

```
function login(username, password, callback) {
    assert(username);
    assert(password);
    assert(callback);
    setTimeout(()=>callback(0), 1000);
}

function sendmsg(msg, callback) {
    assert(msg);
    setTimeout(()=>callback(msg), 500);
}
var gen = null;
function* test() {
    var code = yield login('user', '123', (code)=>{
        gen.next(code);
    });
    console.log('login: ' + code);

    var sendText = yield sendmsg('xxx', (text)=>{
        gen.next(text);
    });
    console.log('send: ' + sendText);

    sendText = yield sendmsg('fuck', (text)=> {
        gen.next(text);
    });
    console.log('send: ' + sendText);
}
gen = test();
gen.next();
```

通过外部的gen变量，在回调里面调用gen.next(result)让自己前进一步。
