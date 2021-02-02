- 异步：只要侦听到数据变化，Vue 将开启⼀个队列，并缓冲在同⼀事件循环中发⽣的所有数据变更。

- 批量：如果同⼀个 watcher 被多次触发，只会被推⼊到队列中⼀次。去重对于避免不必要的计算和 DOM 操作是⾮常重要的。然后，在下⼀个的事件循环“tick”中，Vue 刷新队列执⾏实际⼯作。

- 异步策略：Vue 在内部对异步队列尝试使⽤原⽣的 Promise.then 、 MutationObserver或 setImmediate ，如果执⾏环境都不⽀持，则会采⽤ setTimeout 代替。

异步更新代码执行顺序

1. dep.notify()
   通知更新

2. watcher.update()
   入队请求

3. queueWatcher()
   入队、去重启动异步任务

4. nextTick()
   添加、调用异步任务

5. timerFunc()
   异步执行队列刷新工作

6. watcher.run()
   真正执行更新操作

   