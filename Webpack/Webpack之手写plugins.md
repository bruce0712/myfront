## 如何自己编写一个Plugins

plugin要⽐loader稍微复杂⼀些，在webpack的源码中，⽤plugin的机制还是占有⾮常⼤的场景，可以

说plugin是webpack的灵魂

plugin是⼀个类，⾥⾯包含⼀个apply函数，接受⼀个参数，compiler

**案例** 创建copyright-webpack-plugin.js

```js
class CopyrightWebpackPlugin {
 constructor() {
 }
 //compiler：webpack实例
 apply(compiler) {
 }
}
module.exports = CopyrightWebpackPlugin;
```

- 配置⽂件⾥使⽤

```js
const CopyrightWebpackPlugin = require("./plugin/copyright-webpack-plugin");
plugins: [new CopyrightWebpackPlugin()]
```

- 如何传递参数

```js
//webpack配置⽂件
plugins: [
 new CopyrightWebpackPlugin({
 		name: "阿刚学长"
 })
 ]
//copyright-webpack-plugin.js
class CopyrightWebpackPlugin {
 constructor(options) {
 //接受参数
 console.log(options);
 }
 apply(compiler) {}
}
module.exports = CopyrightWebpackPlugin;
```

- 配置plugin在什么时刻进⾏

```js
class CopyrightWebpackPlugin {
 constructor(options) {
   // console.log(options);
 }
 apply(compiler) {
   //hooks.emit 定义在某个时刻
   compiler.hooks.emit.tapAsync(
     "CopyrightWebpackPlugin",
   	 (compilation, cb) => {
   			compilation.assets["copyright.txt"] = {
   			source: function() {
   			return "hello copy";
      },
   		size: function() {
   				return 20;
   		}
   };
   		cb();
   }
     
    //同步的写法
 //compiler.hooks.compile.tap("CopyrightWebpackPlugin", compilation => {
 // console.log("开始了");
 //});
 );
}
module.exports = CopyrightWebpackPlugin;
```

##### 参考

https://webpack.js.org/api/compiler-hooks

https://webpack.js.org/contribute/writing-a-plugin/