## Webpack基础知识

#### webpack默认配置

- webpack默认支持js模块和JSON模块
- 支持CommonJS Es module AMD等模块类型
- Webpack4支持零配置使用，但是很弱，稍微有复杂的场景都需要额外的扩展

#### Webpack配置核心

webpack有默认的配置文件，叫webpack.config.js,可以对这个文件进行修改，进行个性化配置

- 使用默认的配置文件： webpack.config.js

- 不使用默认的配置文件：比如webpack.config.dev.js;可以通过 --config webpack.config.dev.js来指定we bpack使用哪个配置文件来执行构建

  ```js
  //webpack.config.js配置基础结构
  module.exports = {
    entry: './src/index.js', //打包的入口文件
    output: './dist', //文件打包后输出的路径
    mode: 'production', //打包环境
    module:{
      rules:[
        //loader模块处理
        {
          test:'/\.css$/',
          use:'style-loader'
        }
      ]
    },
    plugins:[new HTMLWebpackPlugin()] //插件配置
  }
  ```

  - **entry**

  指定webpack打包的入口文件：Webpack执行构建的第一步从entry开始，可抽象成输入

  ```js
  //单入口 SPA，本质其实就是字符串
  entry:{
    main:'./src/index.js'
  }
  //=== 相当于简写===
  entry: './src/index.s'
  
  //多入口 MPA， entry是一个对象
  entry:{
    index: './src/index.js',
    main: './src/main.js'
  }
  ```

  - **output**

  打包转换后的文件输出到磁盘位置：输出结果。在webpack经过一系列处理并得出最终想要的代码后输出结果

  ```js
  //单入口处理
  output:{
    filename: "bundle.js",//输出文件的名称
    path: path.resolve(__dirname,'dist') // 输出文件到磁盘目录，必须是绝对路径
  }
  
  //多入口处理
  output:{
    filename: "[name][chunkhash:8].js",//利用占位符，文件名称不要重复
    path: path.resolve(__dirname, 'dist') // 输出文件到磁盘目录，必须是绝对路径
  }**mode**
  ```

  - **mode**

  mode用来指定当前的构建环境

  **production**

  **development**

  **none**

  设置mode可以自动触发webpack中内置的函数，达到优化的效果

  | **选项**    | **描述**                                                     |
  | ----------- | ------------------------------------------------------------ |
  | development | 会将`DefinePlugin`中`process.env.NODE_ENV`的值设置为`development`。为模块和chunk启用有效的名。 |
  | production  | 会将`DefinePlugin`中`process.env.NODE_ENV`的值设置为`production`。为模块和块启用确定性的混淆名称`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`， ，`NoEmitOnErrorsPlugin`和`TerserPlugin`。 |
  | None        | 不使用任何预设优化选项                                       |

  如果没有设置，webpack会给`mode`的替代值设置为`production`

  > 请注意，设置`NODE_ENV`并不会自动地设置`mode`

  - **loader**

  模块解析，模块转换器，⽤于把模块原内容按照需求转换成新内容。

  webpack是模块打包⼯具，⽽模块不仅仅是js，还可以是css，图⽚或者其他格式

  但是webpack默认只知道如何处理**js**和**JSON**模块，那么其他格式的模块处理，和处理⽅式就需要loader了

  ```
  //常见的loader
  style-loader
  css-loader
  less-loader
  sass-loader
  ts-loader //将Ts转换成js
  babel-loader//转换ES6、7等js新特性语法
  file-loader//处理图⽚⼦图
  eslint-loader
  ```

  

  - **module**

  模块，在webpack里一切皆是模块。一个模块对应一个文件。webpack会从配置entry开始递归查找出所有依赖的模块。当webpack处理到了不认识的模块时，需要在webpack中module进行配置，检测到了什么格式的模块就用什么loader来处理。

  ```js
  module:{
    rules:[
      {
        test: '/\.xxxx$/',//指定匹配规则
        use:'xxxx-load'//指定使⽤的loader
      }
    ]
  }
  ```

  **loader: file-loader：处理静态资源模块**

  原理是把打包⼊⼝中识别出的资源模块，移动到输出⽬录，并且返回⼀个地址名称

  所以我们什么时候⽤file-loader呢？

  场景：就是当我们需要模块，仅仅是从源代码挪移到打包⽬录，就可以使⽤file-loader来处理，

  txt，svg，csv，excel，图⽚资源啦等等

  ```js
  npm install file-loader -D
  ```

  ```js
  module: {
    rules: [
      {
        test:'/\.(png|jpe?g|gif)$/',
         //use使⽤⼀个loader可以⽤对象，字符串，两个loader需要⽤数组
        use: {
          loader: 'file-loader',
           // options额外的配置，⽐如资源名称
          options: {
            // placeholder 占位符 [name]⽼资源模块的名称
            // [ext]⽼资源模块的后缀
            // https://webpack.js.org/loaders/file-loader#placeholders
            name: "[name]_[hash].[ext]",
            //打包后的存放位置
            outputPath: "images/"
          }
        }
      }
    ]
  }
  ```

  ```js
  import pic from "./logo.png";
  var img = new Image();
  img.src = pic;
  img.classList.add("logo");
  var root = document.getElementById("root");
  root.append(img);
  ```

  **样式处理**

  Css-loader 分析c s s模块之间,并合并成一个c s s,

  Style-loader 会把css-loader生成的内容，以style挂载到页面的head部分

  ```js
  npm install style-loader css-loader -D
  ```

  ```js
  {
    test: '/\.css$/',
    use:['style-loader','css-loader']
  }
  
  {
    test: '/\.css$/',
    use:[
      {
        loader:'style-loader',
        options:{
          injectType: "singletonStyleTag" // 将所有的style标签合并成⼀个
        }
      },
      'css-loader'
    ]
  }
  ```

  **less样式处理**

  Less-load 把less 语法转换成css

  ```js
  npm install loader less-loader -D
  ```

  ```js
  {
   test: /\.scss$/,
   use: ["style-loader", "css-loader", "less-loader"]
  }
  ```

  **样式自动添加前缀**

  Postcss-loader 

  ```js
  npm i postcss-loader autoprefixer -D
  ```

  ```js
  //webpack.config.js
  {
  	test: /\.css$/,
  	use: ["style-loader", "css-loader", "postcss-loader"]
  },
  //新建  postcss.config.js
   module.exports = {
    plugins: [
    //开课吧web全栈架构师
    	require("autoprefixer")({
    		overrideBrowserslist: ["last 2 versions", ">1%"]
     })
     ]
  };
  ```

  loader处理webpack不支持的格式文件，模块

  一个loader只处理一件事情

  loader执行是有顺序的

  - **Plugins**

    - 作用于webpack打包整个过程
    - webpack的打包过程是有（生命周期概念）钩子

    plugin 可以在webpack运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念

    扩展插件，在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结果或做你想要的事情。

    作⽤于整个构建过程

  **HtmlWebpackPlugin**

  htmlwebpackplugin会在打包结束后，⾃动⽣成⼀个html⽂件，并把打包⽣成的js模块引⼊到该html

  中。

  ```js
  npm install --save-dev html-webpack-plugin
  ```

  配置：

  ```js
  title: ⽤来⽣成⻚⾯的 title 元素
  filename: 输出的 HTML ⽂件名，默认是 index.html, 也可以直接配置带有⼦⽬录。
  template: 模板⽂件路径，⽀持加载器，⽐如 html!./index.html
  inject: true | 'head' | 'body' | false ,注⼊所有的资源到特定的 template 或者
  templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body
  元素的底部，'head' 将放置到 head 元素中。
  favicon: 添加特定的 favicon 路径到输出的 HTML ⽂件中。
  minify: {} | false , 传递 html-minifier 选项给 minify 输出
  hash: true | false, 如果为 true, 将添加⼀个唯⼀的 webpack 编译 hash 到所有包含的脚本和
  CSS ⽂件，对于解除 cache 很有⽤。
  cache: true | false，如果为 true, 这是默认值，仅仅在⽂件修改之后才会发布⽂件。
  showErrors: true | false, 如果为 true, 这是默认值，错误信息会写⼊到 HTML ⻚⾯中
  chunks: 允许只添加某些块 (⽐如，仅仅 unit test 块)
  chunksSortMode: 允许控制块在添加到⻚⾯之前的排序⽅式，⽀持的值：'none' | 'default' |
  {function}-default:'auto'
  excludeChunks: 允许跳过某些块，(⽐如，跳过单元测试的块)
  ```

  **常见的plugins**

  > define-plugin：定义环境变量 
  > html-webpack-plugin：简化html⽂件创建 
  > uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码
  >
  > webpack- parallel-uglify-plugin: 多核压缩,提⾼压缩速度
  >
  > webpack-bundle- analyzer: 可视化webpack输出⽂件的体积
  >
  > mini-css-extract-plugin: CSS提取到单独的⽂件中,⽀持按需加载

  

