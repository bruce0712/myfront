## Typeof  和 instanceof 原理

### Javascript 数据类型

- 空（null)
- 未定义（undefined）
- 布尔值（boolean)
- 字符串（string）
- 数字（number）
- 符号（Symbol)
- 大整数（BigInt）
- 对象（object）

**除对象外，其他统称为基本类型**

```js
typeof null // 'object'
typeof undefined; // "undefined"
typeof false; // "boolean"
typeof 1; // "number"
typeof '1'; // "string"
typeof {}; // "object" 
typeof []; // "object" 
typeof new Date(); // "object"

typeof Symbol(); // "Symbol"
typeof Symbol; //'function'
typeof 123n // 'bigint'
typeof Function //'function'

```

`typeof`是一个操作符而不是函数，用来检测给定变量的数据类型

`typeof null` 为什么返回 `'object'`，稍后会从JavaScript数据底层存储机制来解释。

另外还有一种情况

```js
function foo(){}
typeof foo // 'function'
```

这样看来，`function` 也是`JavaScript`的一个`内置类型`。然而查阅规范，就会知道，它实际上是 `object` 的一个"子类型"。具体来说，函数是“可调用对象”，它有一个内部属性`[[call]]`，该属性使其可以被调用。`typeof` 可以用来区分函数其他对象。

**但是使用 `typeof`不能 判断对象具体是哪种类型。所有`typeof` 返回值为 "object" 的对象（如数组，正则等）都包含一个内部属性 `[[class]]`(我们可以把它看做一个内部的分类)。这个属性无法直接访问，一般通过 `Object.prototype.toString(...)`来查看。**

```js
Object.prototype.toString.call(new Date); // "[object Date]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(/reg/ig); // "[object RegExp]"
Object.prototype.toString.call(Symbol()); // "[object Symbol]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

### typeof原理

typeof原理：**不同的对象在底层都表示为二进制，在javascript中二进制前（低）三位存储的是其类型信息**

- 000:对象
- 010:浮点数
- 100:字符串
- 110:布尔值
- 1：整数

typeof null === 'oject' ,是因为null的二进制都是0，所以它前三个自然也是0，所以执行typeof时会返回"object"

#### `[[prototype]]`机制

`[[prototype]]`机制就是存在与对象中的一个内部链接，它会引用其他对象。 通常来说，这个链接的作用是：**如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在 `[[ptototype]]`关联的对象上进行查找，同理，如果在后者中也没有找到需要的引用就会继续查找它的[[prototype]],以此类推。这一系列对象的链接被称为“原型链”**

### **instanceof**

instanceof是用来比较一个对象是否为某个构造函数的实例

instanceof原理：检测 `constructor.prototype`是否存在于参数 object的 原型链上。`instanceof` 查找的过程中会遍历`object`的原型链，直到找到 `constructor` 的 `prototype` ,如果查找失败，则会返回`false`，告诉我们，`object` 并非是 `constructor` 的实例。

```js
function instanceof(L,R){//L是表达式左边，R是表达式右边
  const O = R.prototype
  L = L.__proto__;
  while(true) {
    if (L === null)
      return false;
    if (L === O) // 这里重点：当 L 严格等于 0 时，返回 true 
      return true;
    L = L.__proto__;
  }
}
```

### Symbol.hasInstance

对象的`Symbol.hasInstance`属性，指向一个内部方法。当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo`在语言内部，实际调用的是Symbol.hasInstance

```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```

