##### 生命周期是什么

vue实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载Dom、渲染、更新等一系列的过程称之为Vue的生命周期。

##### 各个生命周期的作用

| 生命周期        | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| beforeCreate    | 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用 |
| Created         | 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` property 目前尚不可用 |
| beforeMount     | 在挂载之前开始调用：相关的render函数首次被调用               |
| Mounted         | **vue2.x:**实例被挂载后调用，这时 `el` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当 `mounted` 被调用时 `vm.$el` 也在文档内。 <br>**Vue3.0:**实例被挂载后调用，这时 `Vue.createApp({}).mount()` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 `vm.$el` 也在文档内。<br>注意 `mounted` 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 `mounted` 内部使用 [vm。$nextTick](https://v3.cn.vuejs.org/api/instance-methods.html#nexttick)： |
| beforeUpdate    | 组件数据更新之前调用，发生在虚拟DOM打补丁之前                |
| Update          | 组件数据更新之后                                             |
| Activated       | keep-alive专属，组件被激活时调用                             |
| Deadctivated    | keep-alive专属，组件被销毁时调用                             |
| beforeDestory   | 组件销毁之前调用,**在vue3.0,改周期被替代**                   |
| Destroyed       | 组件销毁之后调用,**在vue3.0,改周期被替代**                   |
| beforeUnmount   | **Vue3.0新增**  在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。 |
| Unmounted       | **Vue3.0新增**  卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。 |
| errorCaptured   | 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。 |
| renderTracked   | 跟踪虚拟 DOM 重新渲染时调用。钩子接收 `debugger event` 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。 |
| renderTriggered | 当虚拟 DOM 重新渲染为 triggered.Similarly 为[`renderTracked`](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertracked)，接收 `debugger event` 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。 |

##### 生命周期示意图

![image-20210118211143836](C:\Users\bruce\AppData\Roaming\Typora\typora-user-images\image-20210118211143836.png)![lifecycle_Vue2.x](/Users/wuzhigang/Desktop/myfront/Vue/lifecycle_Vue2.x.png)

##### vue3.0生命周期示意图

![lifecycle_Vue3.0](/Users/wuzhigang/Desktop/myfront/Vue/lifecycle_Vue3.0.png)



##### 异步请求适合在哪个生命周期调用

官方给的实例时在mounted生命周期中调用，但实际上也可以在created生命周期中调用

