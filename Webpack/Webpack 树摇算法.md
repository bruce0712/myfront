## Webpack Tree Shaking

webpack2.x开始⽀持 tree shaking概念，顾名思义，"摇树"，清除⽆⽤ css,js(Dead Code)

Dead Code ⼀般具有以下⼏个特征

- 代码不会被执⾏，不可到达;
- 代码执⾏的结果不会被⽤到;
- 代码只会影响死变量（只写不读）;
- Js tree shaking只⽀持ES module的引⼊⽅式;

#### **Css tree shaking**

```js
npm i glob-all purify-css purifycss-webpack --save-dev
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
plugins:[
  // 清除⽆⽤ css
  new PurifyCSS({
  	paths: glob.sync([
      // 要做 CSS Tree Shaking 的路径⽂件
      path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html ⽂件进⾏ tree shaking
 			path.resolve(__dirname, './src/*.js')
   ])
 })
]
```

#### **JS tree shaking**

只⽀持import⽅式引⼊，不⽀持commonjs的⽅式引⼊

```js
//expo.js
export const add = (a, b) => {
	return a + b;
};
export const minus = (a, b) => {
	return a - b;
};
//index.js
import { add } from "./expo";
add(1, 2);
```

```js
//webpack.config.js
optimization: {
	usedExports: true // 哪些导出的模块被使⽤了，再做打包
}
```

只要**mode**是**production**就会⽣效，**develpoment**的**tree shaking**是不⽣效的，因为**webpack**为了⽅便你的调试

可以查看打包后的代码注释以辨别是否⽣效;⽣产模式不需要配置，默认开启.

### **sideEffects** 处理副作⽤

```js
//package.json
"sideEffects":false //正常对所有模块进⾏tree shaking , 仅⽣产模式有效，
//需要配合usedExports或者 在数组⾥⾯排除不需要tree shaking的模块
"sideEffects":['*.css','@babel/polyfill']
```

