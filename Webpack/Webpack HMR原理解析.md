## Webpack HMR原理解析

webpack的热更新又称热替换（Hot Module Replacement）,缩写为HMR。这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

#### 原理：

- Webpack 在watch的模式下会监听代码模版或者文件发生变化，当监听到发生变化时，根据配置文件信息编译打包，存储在内存中。

- Webpack与Webpack-dev-server 相互交互，Webpack-dev-server会调用中间件Webpack-dev-middleware,Webpack-dev-middleware会调用wepack暴露的API对代码变化进行监控，并且告诉wepack编译打包至内容当中。

- Webpack-dev-server也会监听代码模块或则文件是否发生变化。与webpack的监听不同的是，不是重新打包，当配置文件中devServer.watchContentBase = true 时，文件发生变化时会通知浏览器进行页面刷新（live reload ），而不是HMR操作。

- Webpack-dev-server通过sockjs使浏览器与服务端建立websocket长连接，将webpack编译打包的各个阶段过程告知浏览器，以及新模块的hash值，后面会根据hash进行热更新处理。浏览器会根据这些socket信息进行不同的操作。

- Webpack-dev-server/client 端不会请求更新代码，也不会进行热更新替换操作。它会把获取到的信息传递给Webpack/hot/dev-server,dev-server会根据配置信息决定会做热更新还是浏览器页面刷新。

- 若是热更新处理，则会调用HotModuleReplacement.runtime()方法。runtime中支持check和apply两个方法。

  - **check**   方法，接收到上一步传递给他的新模块的 hash 值，发送一个 HTTP 请求来更新 manifest。如果请求失败，说明没有可用更新。如果请求成功，会将 updated chunk 列表与当前的 loaded chunk 列表进行比较。每个 loaded chunk 都会下载相应的 updated chunk。当所有更新 chunk 完成下载，runtime 就会切换到 `ready` 状态。

  - **apply**方法，将所有 updated module 标记为无效。对于每个无效 module，都需要在模块中有一个 update handler，或者在此模块的父级模块中有 update handler。否则，会进行无效标记冒泡，并且父级也会被标记为无效。继续每个冒泡，直到到达应用程序入口起点，或者到达带有 update handler 的 module（以最先到达为准，冒泡停止）。如果它从入口起点开始冒泡，则此过程失败。

    之后，所有无效 module 都会被（通过 dispose handler）处理和解除加载。然后更新当前 hash，并且调用所有 `accept` handler。runtime 切换回 `idle` 状态，一切照常继续。

- 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

![HMR0001](/Users/wuzhigang/Desktop/myfront/Webpack/HMR0001.jpg)