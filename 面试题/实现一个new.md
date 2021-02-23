## 实现了一个new

一般创建一个对象的实例为 var person = **new** Person()

那么此时的**new**干了哪些事情呢?

- 创建了一个空对象
- 将新对象的原型指向了当前函数的原型
- 新创建的对象通过apply绑定到当前的this上,判断如果该函数没有返回对象，则返回this

```js
function _new(constructor,...args){
  //创建一个空对象 obj
  const obj = {};
  //将新对象的指针指向构造函数的原型对象
  obj.__proto__ = constructor.prototype;
  //新创建的对象绑定到this上
  const result = constructor.apply(obj,args)
  //通过判断，如果返回的是个对象，则返回该对象，否则新创建的obj;
  return  typeof result === 'object' ? result : obj;
}

function Person(name) {
    this.name = name;
}
var person = _new(Person, 'lily');
luckyStar.name; //lily
```

