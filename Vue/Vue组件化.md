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

