## Promise原理

**Promise**对象用于表示一个异步操作的最终完成或失败及其结果

一个`Promise` 对象必然处于以下状态之一

- 待定(peding):初始化状态，既没有被兑现，也没有被拒绝。
- 已兑现(fulfilled):意味着操作成功完成。
- 已拒绝(rejected):意味着操作失败

#### Promise.resolve的特点：

- 如果参数是一个Promsie实例，那么Promise.resolve将不做任何修改，原封不动的返回这个实例
- 如果参数是一个原始值，或者是一个不具有then方法的对象,则Promise.resolve方法返回一个新的Promise对象，状态为resolved

#### Promise.all的特点：

- Promise.all方法接受一个数组作为参数，p1、p2、p3都是Promise实例，如果不是，就会调用Promise.resolve方法，将参数转为Promise实例，再进一步处理。
- 返回值组成一个数组
- p1、p2、p3中有一个被rejected,p的状态就变成rejected,此时第一个被reject的实例的返回值会传递给p的回调函数

**Promise.race的特点:**

- Promise.race方法的参数与Promise.all方法一样，如果不是Promise实例，就会调用Promise.resolve方法，将参数转为Promise实例，再进一步处理。
- 返回那个率先改变的Promise实例的返回值

**Promise.allSettled的特点：**

- Promise.allSettled方法接受一个数组作为参数，p1、p2、p3都是Promise实例，如果不是，就会调用Promise.resolve方法，将参数转为Promise实例，再进一步处理。
- 将p1、p2、p3处理的结果返回出来

```js
class MyPromise {
    constructor(fn) {
        /**
         * 三种状态
         * pendding：进行中
         * fulfilled：已兑现，
         * rejected: 已拒绝
         */
        this.status = "pendding"
        this.resoledList = []
        this.rejectedList = []
        fn(this.resolve.bind(this),this.rejected.bind(this))
    }
    then(scb,fcb) {
        if(scb) {
            this.resoledList.push(scb)
        }
        if(fcb) {
            this.rejectedList.push(fcb)
        }
        return this
    }
    catch(fcb){
        if(fcb) {
           this.rejectedList.push(fcb)
        }
        return this
    }
    resolve(data){
        if(this.status !== 'pendding') return
        this.status = 'fulfilled'
        setTimeout(()=>{
            console.log(this.resoledList)
            this.resoledList.forEach(item=>{
                data = item(data)
            })
        })
    }
    rejected(err) {
        if(this.status !== 'pendding') return
        this.status = 'rejected'
        setTimeout(()=>{
            this.rejectedList.forEach(item=>{
                err = item(err)
            })
        })
    }

    static resolve(data) {
        if(data instanceof MyPromise) {
            return data
        } else {
            return new MyPromise((resolve,rejected)=>{
                resolve(data)
            })
        }
    }
    static rejected(err) {
        if(err instanceof MyPromise) {
            return err
        }else {
            return new MyPromise((resolve,rejected)=>{
                rejected(err)
            })
        }
    }
    //满足所有的成功，才返回resolve
    static all(promises) {
        return new MyPromise((resolve,rejected) =>{
            let promiseCount = 0;
            let promiseLength = promises.length
            let result =[]
            for (let i = 0; i < promises.length-1; i++) {
                MyPromise.resolve(promises[i]).then(res =>{
                    promiseCount++
                    result[i] = res
                    if(promiseCount === promiseLength) {
                      return resolve(result[i])
                    }
                }).catch(err=>{
                    return rejected(err)
                })
            } 
        })
    }
    //只要有个成功的就返回成功的
    static any(promises){
        return new MyPromise((resolve, rejected) =>{
            let promiseCount = 0;
            let promiseLength = promises.length
            let result =[]
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promises[i]).then(res=>{
                    return  resolve(res)
                }).catch(err=>{
                    promiseCount ++
                    result[i] = err
                    if(promiseCount === promiseLength) {
                        return  rejected(result[i])
                    }
                })
                
            }
        })
    }
    // 返回 执行的结果的状态，不管是成功还是失败
    static allSettled(promises) {
        return new MyPromise((resolve, rejected) =>{
            if (!Array.isArray(promises)) {
                return reject(
                    new TypeError("arguments must be an array")
                );
            }
            var resolvedCounter = 0;
            var promiseNum = promises.length;
            var resolvedValues = new Array(promiseNum);
            for (var i = 0; i < promiseNum; i++) {
                (function(i) {
                    Promise.resolve(promises[i]).then(
                        function(value) {
                            resolvedCounter++;
                            resolvedValues[i] = value;
                            if (resolvedCounter == promiseNum) {
                                return resolve(resolvedValues);
                            }
                        },
                        function(reason) {
                            resolvedCounter++;
                            resolvedValues[i] = reason;
                            if (resolvedCounter == promiseNum) {
                                return reject(reason);
                            }
                        }
                    );
                })(i);
            }
        })
    }
    //只要有某个promise返回成功或者拒绝，就直接返回成功或者拒绝
    static race(promsies) {
        return new MyPromise((resolve,rejected)=>{
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promise[i])
                .then(res=>{
                    return resolve(res)
                }).catch(err=>{
                    return rejected(err)
                })
                
            }
        })
    }
    static finally(callBcak){
        return  MyPromise.then(
            value => MyPromise.resolve(callBcak()).then(()=>value),
            reason => MyPromise.rejected(callBcak()).then(()=>  {throw reason})
        )
    }
}


//------ test

var p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolve');
        resolve(222);
    }, 1000)
})

p.then(data => {
    setTimeout(() => {
        console.log('data', data);
    })
    return 3333;
}).then(data2 => {
    console.log('data2', data2);
}).catch(err => {
    console.error('err', err);
}).finally(cb => {
    console.log('finally',cb)
});
```



