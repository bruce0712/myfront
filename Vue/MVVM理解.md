### MVVM是什么

MVVM模式  Model-View-ViewModel模式。萌芽于2005年微软推出的基于windows的用户界面框架WPF，前端最早的MVVM框架knockout 在2010年发布。

Model层：对应数据层的域模型，它主要做域模型的同步。通过Ajax/Fetch等API完成客户端和服务端业务Model的同步。在层间关系中，主要是抽象出ViewModel中试图的Model。

View层：作为视图模板的存在，在MVVM里，整个View是一个动态的模板。除了定义结构布局外，它展示ViewModel层的数据和状态。View层不负责处理状态，View层做的是数据绑定的声明，指令的声明，事件的绑定声明。

ViewModel层：把View层需要的数据暴露，并对View层的数据绑定声明，指令声明，事件绑定声明解析，处理View层的具体的业务逻辑。ViewModel底层会做好绑定属性的监听。当ViewModel中的数据变化，View层会得到更新；而当View中声明了数据的双向绑定，框架也会监听View层值的变化。一旦值发生变化，View层绑定的ViewModel中的数据也会得到自动更新。

![image-20210117214802389](G:\myfront\Vue\image-20210117214802389.png)

#### MVVM的优缺点

- 优点：
  1. 分离视图（View）和模型（Model），降低代码的耦合，提高视图或者逻辑的重用性：比如视图（View)可以独立于Model变化和修改，一个ViewModel可以绑定不同的'View'上，当View变化的时候Model可以不变，当Model变化时View也可以不变。可以把一些视图逻辑放在一个ViewModel里面，让很多View重用这段视图逻辑；
  2. 提高可测试性：ViewModel的存在可以帮助开发者更好地编写测试代码；
  3. 自动更新dom：利用双向绑定，数据更新后视图自动更新，让开发者从繁琐的手动dom中解放
- 缺点：
  1. Bug比较难调试：因为使用双向绑定的模式，当你看到界面异常了，有可能是View代码有Bug,也可能是Model的代码有问题。
  2. 一个大的模块中mode也会很大，虽然使用方便也很容易保证数据的一致性，但是长期持有没有释放，会占用很多内存
  3. 对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高

