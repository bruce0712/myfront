## Vue流程初始化过程

1. new Vue() :     创建vue实例，这个过程中会调用_init 初始化方法

2. _init():  合并options，执行初始化逻辑

   - initLifecycle(vm) //$prarent/$root/$chlidren 初始化
   - initEvents(vm) // 事件监听
   - initRender(vm) //slots/$createElement() 方法声明
   - callHook(vm, 'beforeCreate') //组件创建之前的钩子
   - initInjections(vm) //注入祖辈传递的数据
   - initState(vm) //重要：组件数据初始化，包props/data/methods/computed/watch
   - initProvide(vm) // resolve provide after data/props
   - callHook(vm, 'created')
   - $mount() 方法

3. $mount: 获取用户的配置选项，获取渲染函数;得知一下执行顺序为：el<template<render

   -  编译：获取渲染函数

      const { **render**, staticRenderFns } = **compileToFunctions**(template,{...})

   - 默认执行挂载功能

     mount.call(this, el, hydrating)

   - mountComponent：//执行挂载，获取vdom并转换成dom

     - updateComponent = () => {     //执行初始化或更新
             vm._update(vm._render(), hydrating)
           }
     - new Watcher（）// 创建组件渲染watcher
     - Update  //初始化或更新，将传入vdom转换为dom，初始化时执行的是dom创建操作
     - render:   渲染组件，获取vdom
     - callHook(vm, 'mounted')；//返回钩子mounted，表示页面初始化渲染完成

     

   

