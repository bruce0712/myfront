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

