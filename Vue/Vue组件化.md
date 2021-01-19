## vue组件化

##### 组件化作用

提高开发效率，方便重复使用，简化调试步骤，提升项目可维护性，便于多人协同开发

##### 组件渲染

**父子组件渲染顺序**

```js
  //父组件代码
	beforeCreate(){
    console.log('beforeCreate,我是父组件');
  },
  created(){
    console.log('created,我是父组件');
  },
  beforeMount(){
     console.log('beforeMount,我是父组件');
  },
  mounted(){
    console.log('mounted,我是父组件');
  },
  beforeDestroy() {
    console.log('beforeDestroy,我是父组件');
  },
  destroyed(){
    console.log('destroyed,我是父组件');
  },
```

```js
//子组件代码
beforeCreate(){
	console.log('beforeCreate,我是子组件');
},
created(){
	console.log('created,我是子组件');
},
beforeMount(){
	console.log('beforeMount，我是子组件');
},
mounted(){
	console.log('mounted，我是子组件');
},
```

**控制台返回的执行顺序为**:

beforeCreate,我是父组件 ----> created,我是父组件 --->  beforeMount,我是父组件 ---> beforeCreate,我是子组件
---> created,我是子组件 ---> beforeMount，我是子组件 --->  mounted，我是子组件 ---> mounted,我是父组件

**父子组件销毁顺序**

```js
//父组件代码
beforeDestroy() {
  console.log('beforeDestroy,我是父组件');
},
destroyed(){
  console.log('destroyed,我是父组件');
}
```

```js
//子组件代码
beforeDestroy(){
  console.log('beforeDestroy,我是子组件');
},
destroyed(){
	console.log('destroyed,我是子组件');
},
```

**控制台中打印销毁的顺序为**

beforeDestroy,我是父组件 ---> beforeDestroy,我是子组件 ---> destroyed,我是子组件 ---> destroyed,我是父组件

##### 组件通信方式

**props** 

```js
//父组件向子组件传值
// child
props: { msg: String }
// parent
<HelloWorld msg="Welcome to Your Vue.js App"/>
```

**$refs**

```js
//获取⼦节点引⽤
// parent
<HelloWorld ref="hw"/>
mounted() {
this.$refs.hw.xx = 'xxx'
}
```

**$children**

⽗组件可以通过$children访问⼦组件实现⽗⼦通信。

```js
//parent
this.$children[0].xx =  'xxx'
```

**$attrs/$listeners**

包含了⽗作⽤域中不作为 prop 被识别 (且获取) 的特性绑定 ( class 和 style 除外)。当⼀个组件没有声明任何 prop 时，这⾥会包含所有⽗作⽤域的绑定 ( class 和 style 除外)，并且可以通过 vbind="$attrs" 传⼊内部组件——在创建⾼级别的组件时⾮常有⽤。  

```vue
//child:并未在props中声明foo
<p>{{$attrs.foo}}</p>

//parent
<HelloWorld foo="foo"/>
```

**$emit("xx")**

子给父传值

```vue
//child
this.$emit('add',good)

//parent
<Cart @add="cartAdd($event)"></Cart>
```

**$parent/$root**

兄弟组件之间通信可通过共同祖辈搭桥，$parent/$root.

```js
//brohter1
this.$parent.$on('foo',handle)
//brother2
this.$parent.$emit('foo')
```

**provide/inject**

能够实现祖先和后代之间传值

```js
//ancestor
provide(){
    return {foo:'foo'}
}
//descendant
inject:['foo']
```

**事件总线$bus**

任意两个组件之间传值常用事件总线或者vuex的方式。

```js
//Bus:事件派发、监听和回调管理
class Bus {
    constructor(){
        this.callbacks = {}
    }
    $on(name,fn) {
        this.callbacks[name] = this.callbacks[name]||[]
        this.callbacks[name].push(fn)
    }
    $emit(name,args) {
        if(this.callbacks[name]) {
            this.callbacks[name].forEach(cb=>cb[args])
        }
    }
}
// main.js
Vue.prototype.$bus = new Bus()
// child1
this.$bus.$on('foo',handle)
//child2
this.$bus.$emit('foo')
//实践中通常用Vue代替Bus,因为Vue已经实现了响应接口

```

**vuex**

创建唯一的全局管理者store，通过它管理数据并通知组件状态变更。

##### 组件实例创建和挂载

**实例创建**

- 通过Vue构造函数创建，此时组件实例作为根组件的孩子<br> new Vue({render(){return h(Component)}}) <br> 文档：https://cn.vuejs.org/v2/guide/render-function.html <br> 获得组件构造函数并实例化
- const Ctor = Vue.extent(Compontent)<br> const comp = new Ctor({prosData:props})<br> 文档：https://cn.vuejs.org/v2/api/#Vue-extend

**挂载**

- 虚拟DOM转换真是DOM

  $mount() <br> 文档：https://cn.vuejs.org/v2/api/#vm-mount

  

  

