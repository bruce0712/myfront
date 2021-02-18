## 如何自己编写一个loader

### 什么是loader

webpack本身默认只能解析js和json文件，loader相当于扩展了webpack能够解析除js和JSON以外的内容的能力。

loader类似于转换器。它可以将依赖的文件转换成js module ,用于webpack 解析

下面就是一个 css 文件经过 css-loader 处理之后生成的内容：

```js
// Imports
import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\n    color: red;\n}\n\n.demo {\n    width: 200px;\n    height: 200px;\n    background: peachpuff;\n    border: 1px solid grey;\n}", ""]);
// Exports
export default ___CSS_LOADER_EXPORT___;
```

loader就是一个函数，声明式函数，不能用箭头函数

我们都知道，在项目中处理样式时，需要配置 css-loader、style-loader，才能成功渲染样式。
我们还知道 loader 配置时，loader的读取顺序是从下往上或者从右往左的。

- loader 可以链式调用，它按照从右到左的顺序依次调用。
  第一个 loader 接收到的参数就是当前依赖文件的内容，之后的loader 接收到的参数就是上一个 loader 处理之后的返回值，最后一个 loader 返回值必须是 JavaScript。
- loader 的编写遵循单一原则，一个 loader 只做一件事情。这使得 loader 易于维护，也更容易复用到其他场景下，进行组合使用。
- 进行模块化的输出，loader 输出的内容一般都是一个 js module

### 实现简单的案例

- 创建⼀个替换源码中字符串的loader

  ```js
  //index.js
  console.log("hello agangxuezhang");
  
  //replaceLoader.js
  module.exports = function(source) {
   console.log(source, this, this.query);
   return source.replace('agangxuezhang','阿刚学长')
  };
  
  //需要⽤声明式函数，因为要上到上下⽂的this,⽤到this的数据，该函数接受⼀个参数，是源码
  ```

- 在配置文件中使用loader

  ```js
  //需要使⽤node核⼼模块path来处理路径
  const path = require('path')
  module: {
  	rules: [
     {
       test: /\.js$/,
       use: path.resolve(__dirname, "./loader/replaceLoader.js")
     }
   ]
  },
  ```

- 如何给loader配置参数，loader接受参数

  - this.query
  - loader-utils ：官⽅推荐处理loader,query的⼯具

  ```js
  //webpack.config.js
  module: {
   rules: [
     {
       test: /\.js$/,
       use: [
         {
           loader: path.resolve(__dirname, "./loader/replaceLoader.js"),
           options: {
           	name: "阿刚学长"
           }
       }
       ]
     }
   ]
  },
   
  //replaceLoader.js
  //const loaderUtils = require("loader-utils");//官⽅推荐处理loader,query的⼯具
  module.exports = function(source) {
   //this.query 通过this.query来接受配置⽂件传递进来的参数
   //return source.replace("agangxuezhang", this.query.name);
   const options = loaderUtils.getOptions(this);
   const result = source.replace("agangxuezhang", options.name);
   return source.replace("agangxuezhang", options.name);
  }
  ```

- **this.callback()**:如果需要返回多个信息，不止是处理好的源码，可以使用this.callback()来处理

  ```js
  //replaceLoader.js
  const loaderUtils = require("loader-utils");//官⽅推荐处理loader,query的⼯具
  module.exports = function(source) {
   const options = loaderUtils.getOptions(this);
   const result = source.replace("agangxuezhang", options.name);
   this.callback(null, result);
  };
  
  //this.callback参数方法
  this.callback(
   err: Error | null,
   content: string | Buffer,
   sourceMap?: SourceMap,
   meta?: any
  );
  ```

- 多个loader地使用，webpack默认的执行loader顺序为⾃下⽽上，⾃右到左的。

  ```js
  //replaceLoader.js
  module.exports = function(source) {
   return source.replace("阿刚学长", "word");
  };
  //replaceLoaderAsync.js
  const loaderUtils = require("loader-utils");
  module.exports = function(source) {
   const options = loaderUtils.getOptions(this);
   //定义⼀个异步处理，告诉webpack,这个loader⾥有异步事件,在⾥⾯调⽤下这个异步
   const callback = this.async();
   setTimeout(() => {
   const result = source.replace("agangxuezhang", options.name);
   callback(null, result);
   }, 3000);
  };
  
  //webpack.config.js
  module: {
   rules: [
   	{
       test: /\.js$/,
       use: [
       	path.resolve(__dirname, "./loader/replaceLoader.js"),
       	{
       		loader: path.resolve(__dirname, "./loader/replaceLoaderAsync.js"),
       		options: {
       			name: "阿刚学长"
       		}
       	}
       ]
     // use: [path.resolve(__dirname, "./loader/replaceLoader.js")]
      }
    ]
   },
    
  ```

- **越过loader （Pitching loader）**

  loader **总是**从右到左地被调用。有些情况下，loader 只关心 request 后面的**元数据(metadata)**，并且忽略前一个 loader 的结果。在实际（从右到左）执行 loader 之前，会先**从左到右**调用 loader 上的 `pitch` 方法。对于以下 [`use`](https://www.webpackjs.com/configuration/module#rule-use) 配置：

  ```
  use: [
    'a-loader',
    'b-loader',
    'c-loader'
  ]
  ```

  将会发生这些步骤：

  ```
  |- a-loader `pitch`
    |- b-loader `pitch`
      |- c-loader `pitch`
        |- requested module is picked up as a dependency
      |- c-loader normal execution
    |- b-loader normal execution
  |- a-loader normal execution
  ```

  那么，为什么 loader 可以利用 "跳跃(pitching)" 阶段呢？

  首先，传递给 `pitch` 方法的 `data`，在执行阶段也会暴露在 `this.data` 之下，并且可以用于在循环时，捕获和共享前面的信息。

  ```js
  module.exports = function(content) {
      return someSyncOperation(content, this.data.value);
  };
  
  module.exports.pitch = function(remainingRequest, precedingRequest, data) {
      data.value = 42;
  };
  ```

  其次，如果某个 loader 在 `pitch` 方法中给出一个结果，那么这个过程会回过身来，并跳过剩下的 loader。在我们上面的例子中，如果 `b-loader` 的 `pitch` 方法返回了一些东西：

  ```js
  module.exports = function(content) {
    return someSyncOperation(content);
  };
  
  module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    if (someCondition()) {
      return "module.exports = require(" + JSON.stringify("-!" + remainingRequest) + ");";
    }
  };
  ```

  上面的步骤将被缩短为：

  ```
  |- a-loader `pitch`
    |- b-loader `pitch` returns a module
  |- a-loader normal execution
  ```

- **处理loader的路径问题**

  ```js
  resolveLoader: {
     modules: ["node_modules", "./loader"]
  },
  module: {
     rules: [
     {
     		test: /\.js$/,
     		use: [
     			"replaceLoader",
     		{
          loader: "replaceLoaderAsync",
          options: {
            name: "阿刚学长"
          }
     		}
     ]
     // use: [path.resolve(__dirname, "./loader/replaceLoader.js")]
     }
     ]
   },
  ```

  

