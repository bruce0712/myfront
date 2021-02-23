## 彻底理解this、call、apply、bind

### this

- 普通函数指向函数调用者：有个简单的方法就是**看函数前面有没有点**，如果有点，就指向点前面的那个值
- 箭头函数指向函数所在的作用域：注意理解作用域,只有`函数的{}`构成作用域,`对象的{}`以及 `if(){}`都不构成作用域;

#### 普通函数调用

1. 默认绑定

   ```js
   var a = 'xxxx'
   function Foo(){
     console.log(this.a)
   }
   Foo()
   //xxxxx
   ```

   Foo调用在非严格模式下是指向window,严格模式下值为undefined

2. 隐式绑定

   ```js
   var a = 'lilei';
   var obj = {
       a: 'hanmeimei',
       foo() {
           console.log(this.a);
       }
   }
   obj.foo(); // ①
   // hanmeimei
   
   var bar = obj.foo; 
   bar(); // ②
   // lilei 
   
   setTimeout(obj.foo, 100); // ③
   // lilei 
   ```

   

3. 显示绑定

   ```js
   function foo() {
       console.log(this.name);
   }
   const obj = {
       name: 'lilei'
   }
   const bar = function() {
       foo.call(obj);
   }
   bar();
   // lilei
   ```

   使用 call，apply可以显式修改 this的指向

4. new绑定

   ```js
   function Foo(name) {
       this.name = name;
   }
   var luckyStar = new Foo('hanmeimei');
   luckyStar.name; 
   // hanmeimei
   
   ```

#### 箭头函数调用

箭头函数中没有this绑定，箭头函数中的this指向函数所在的作用域，箭头函数不能作为构造函数

```js
const obj = {
    name: 'lilei',
    say() {
        console.log(this.name);
    },
    read: () => {
        console.log(this.name);
    }
}
obj.say(); // lilei
obj.read(); // undefined
```

### Call、apply、bind

Call,apply,bind三个函数都是Function原型上的方法，`Function.prototype.call()`，`Function.prototype.apply`，`Function.prototype.bind()`，所有的函数都是 `Funciton` 的实例，因此所有的函数可以调用call，apply，bind 这三个方法。

**Call, apply,bind作用**改变函数执行的上下文，简而言之改变函数运行时this的指向

**不通点：**

- Call, apply,会立即执行，返回的是调用函数的结果；
- Bind不会立即执行，返回的是一个新的函数。
- call和apply的区别就是，call接受的是一系列参数，而apply接受的是一个数组。

但是有了 ES6引入的 `...`展开运算符，其实很多情况下使用 call和apply没有什么太大的区别。

举个例子，找到数组中最大的值

```js
const arr = [1, 2, 3, 5];
Math.max.call(null, ...arr);
Math.max.apply(null, arr);
```

`Math.max` 是数字的方法，数组上并没有，但是我们可以通过 call, apply 来使用 `Math.max` 方法来计算当前数组的最大值。

**实现一个call**

```js
Function.prototype.mycall = function(thisArgs=Window) {
  //thisArgs.fn 指向当前函数 fn (fn.myCall)
  thisArgs.fn = this
  //第一个参数为this,取出剩下的所有的参数，
  const args = [...arguments].slice(1)；
  //指向函数
  const result = thisArgs.fn(args)
  //this.Args 并不存在fn，所以要移除fn
  delete thisArgs.fn;
  //返回执行结果
  return result;
}


function foo() {
    console.log(this.name);
}
const obj = {
    name: 'litterStar'
}
const bar = function() {
    foo.myCall(obj);
}
bar();
// litterStar
```

**实现一个apply**

实现一个apply 过程很call类似，只是参数不同，不再赘述

```js
Function.prototype.myApply = function(thisArgs=Window) {
  thisArgs.fn = this
  let result
  if(argument[1]) {
    result = thisArgs.fn(...arguments[1])
  } else {
    result = thisArgs.fn()
  }
  delete thisArgs.fn
  return result
}
```

**实现一个bind**

MDN上的解释：bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
Function.prototype.myBind = function(thisArgs) {
  if (typeof this !== "function") {  
    throw new TypeError("Error");   
  }
  //保存当前函数this
  const fn = this;
  //保存原先的参数
  const args = [...arguments].slice(1);
  //返回一个新的函数
  return function Fn() {
    //再次获取新的参数
    const newArgs = [...arguments]
    //1.修改当前函数this为thisArgs
    //2.将多次传入的参数一次性传入函数中
    return fn.apply(this instanceof Fn ? new fn(...argument): thisArgs, args.concat(newArgs))
  }
  
}
const obj1 = {
    name: 'litterStar',
    getName() {
        console.log(this.name)
    }
}
const obj2 = {
    name: 'luckyStar'
}

const fn = obj1.getName.myBind(obj2)
fn(); // luckyStar
```

