## 虚拟Dom

虚拟dom是对dom对象的js抽象描述，是js对象。

**虚拟Dom优点**

- 虚拟Dom轻量，快速：当它们发生变化时，通过新旧虚拟Dom对比可以得到最小的dom操作量，配合异步策略减少刷新频率，从而提升性能；

  ```
  patch(vnode, h('div', obj.foo))
  ```

- 跨平台：将虚拟dom更新转换为不同运⾏时特殊操作实现跨平台

  ```
  <script src="../../node_modules/snabbdom/dist/snabbdom-style.js"></script> <script>
  // 增加style模块
  const patch = init([snabbdom_style.default])
  function render() {
  // 添加节点样式描述
  return h('div', { style: { color: 'red' } }, obj.foo)
   }
  </script>
  ```

- 兼容性：还可以加⼊兼容性代码增强操作的兼容性

**虚拟Dom必要性**

vue 1.0中有细粒度的数据变化侦测，它是不需要虚拟DOM的，但是细粒度造成了⼤量开销，这对于⼤

型项⽬来说是不可接受的。因此，vue 2.0选择了中等粒度的解决⽅案，每⼀个组件⼀个watcher实例，

这样状态变化时只能通知到组件，再通过引⼊虚拟DOM去进⾏⽐对和渲染。

**虚拟Dom整体流程**

- **mountComponent() core/instance/lifecycle.js**

  渲染、更新组件

  ```js
  // 定义更新函数
  const updateComponent = () => {
  // 实际调⽤是在lifeCycleMixin中定义的_update和renderMixin中定义的_render
  vm._update(vm._render(), hydrating) }
  ```

- **_render core/instance/render.js**

  ⽣成虚拟dom

- **_update core\instance\lifecycle.js**

  update负责更新dom，转换vnode为dom

- **__patch__() platforms/web/runtime/index.js**

  __patch__是在平台特有代码中指定的

  ```js
  Vue.prototype.__patch__ = inBrowser ? patch : noop
  ```

  
