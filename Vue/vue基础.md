#### vue基础

##### vue常用的修饰符有哪些？

###### 1.事件修饰符：

```vue
<!--阻止点击事件的继续传播-->
<a v-on:click.stop="doThis"></a>

<!--提交事件不再重载页面-->
<!--prevent用于阻止默认事件-->
<form v-on:submit.prevent="onSubmit"></form>

<!--修饰符可以串联使用-->
<a v-on:click.stop.prevent="doTaht"></a>

<!--添加事件监听器时使用事件捕获模式-->
<!--内部元素触发的事件先在此处理，然后才交由内部元素进行处理-->
<div v-on:click.capture="doThis">...</div>

<!--只当在event.target是当前元素自身时触发处理函数-->
<!--即元素不是从内部元素触发的-->
<div v-on:click.self="doThat"> ...</div>

<!--点击事件将只会触发一次-->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<!--passive 修饰符尤其能够提升移动端的性能。-->
<div v-on:scroll.passive="onScroll">...</div>

```

使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。

###### 2.按键修饰符

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 `v-on` 在监听键盘事件时添加按键修饰符：.enter .tab .delete .esc .space .up .down .left .right

```vue
<!--只有在key 是 Enter 时调用 vm.submit() -->
<input v-on:keyup.enter="submit">
<input v-on:keyup.page-down="onPageDown">
```

###### 3.系统修饰码

可以使用如下修饰符来实现仅在按下相应按键时才触发鼠标或者键盘事件的监听器。 .ctrl .alt .shift .meta

```vue
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>
<!--exact修饰符-->
<!--exact修饰符允许你控制由精确的系统修饰符组合触发的事件-->
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

###### 4.修饰符.sync

prop属性是只读的，如果我们要对一个prop进行双向绑定，一般操作如下

```vue
//父组件给子组件传入一个函数
 <MyFooter :age="age" @setAge="(res)=> age = res">
 </MyFooter>
 //子组件通过调用这个函数来实现修改父组件的状态。
 mounted () {
      console.log(this.$emit('setAge',1234567));
 }
```

更加方便的写法，使用.sync

```vue
//父组件将age传给子组件并使用.sync修饰符。
<MyFooter :age.sync="age">
</MyFooter>
//子组件触发事件
 mounted () {
    console.log(this.$emit('update:age',1234567));
 }
```

如果要设置多个prop的时候，可以将.sync 修饰夫与v-bind结合使用

```html
<text-document v-bind.sync="doc"></text-document>
```

1. .sync修饰符的v-bing不能和表达式一起使用，(例如 `v-bind:title.sync=”doc.title + ‘!’”` 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 `v-model`。
2. v-bind:sync 不能绑定一个字面量对象 v-bing.sync="{title:doc.title}",因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。

##### vue-cli ⼯程常⽤的 npm 命令有哪些？  

1. npm install @vue/cli -g         全局安装vue-cli
2. npm update -g @vue/cli      更新升级vue-cli 包
3. vue --version 查看vue-cli 版本
4. vue create my-project  构建一个my-project的vue的项目
5. npm run serve 启动开发环境服务器
6. npm run build 打包压缩成静态文件

##### vue中 keep-alive 组件的作⽤ ？

props: 

- `include` - 字符串或正则表达式。只有名称匹配的组件会被缓存
- `exclude` - 字符串或正则表达式。任何名称匹配的组件都不会被缓存
- `max` - 数字。最多可以缓存多少组件实例。

```html
<!-- 会将失活的组件进行缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

