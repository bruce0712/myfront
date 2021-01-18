##### 生命周期是什么

vue实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载Dom、渲染、更新等一系列的过程称之为Vue的生命周期。

##### 各个生命周期的作用

| 生命周期      | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                       |
| Created       | 组件的实例已经完全创建，属性也绑定了，data和methods 方法可以访问，但是真是dom还没有生成，$el还不可用 |
| beforeMount   | 在挂载之前开始调用：相关的render函数首次被调用               |
| Mounted       | el被新创建的vm.$el替换，并挂载到实例上去后调用改钩子         |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟DOM打补丁之前                |
| Update        | 组件数据更新之后                                             |
| Activated     | keep-alive专属，组件被激活时调用                             |
| Deadctivated  | keep-alive专属，组件被销毁时调用                             |
| beforeDestory | 组件销毁之前调用                                             |
| Destroyed     | 组件销毁之后调用                                             |

##### 生命周期示意图

![image-20210118211143836](C:\Users\bruce\AppData\Roaming\Typora\typora-user-images\image-20210118211143836.png)

##### 异步请求适合在哪个生命周期调用

官方给的实例时在mounted生命周期中调用，但实际上也可以在created生命周期中调用