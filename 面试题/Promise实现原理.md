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
    constructor(fn){
        /**
         * 有三种状态
         * pending: 待处理状态
         * fulfilled: 已兑现状态
         * rejected: 已拒绝状态
         */
        this.status = "pending" // 状态标识
        this.resolveList = [];  // 接受所有已兑现的结果
        this.rejectList = []; // 接受所有已拒绝的结果
        fn(this.resolve.bind(this),this.reject.bind(this))
    }

    then(scb,fcb){
        if(scb) {
            this.resolveList.push(scb)
        }
        if(fcb) {
            this.rejectList.push(fcb)
        }
        return this
    }
    catch(fcb){
        if(fcb) {
            this.rejectList.push(fcb)
        }
        return this
    }
    resolve(data) {
        if(this.status !== 'pending') return
        this.status = 'fulfilled'
        setTimeout(()=>{
            this.resolveList.forEach(item => {
                data = item(data)
            })
        })
    }
    reject(err){
        if(this.status !=="pending") return
        this.status = 'rejected'
        setTimeout(()=>{
            this.rejectList.forEach(item => {
                err = item(err)
            })
        })
    }

    static resolve(promise) {
        if(promise instanceof MyPromise) {
            return promise
        }else {
            return new MyPromise((resolve,reject) => {
                resolve(promise)
            })
        }
    }

    static reject(promise) {
        if(promise instanceof MyPromise) {
            return promise
        }else {
            return new MyPromise((resolve,reject)=>{
                reject(promise)
            })
        }
    }

    /**
     * @description 如果不是 Mypromise实例，则转化成实例，
     * 当所有的内容都返回了已兑现的状态，就都返回，否则返回第一个被拒绝的值
     * @param {*} promises as Array
     */
    static all(promises) {
        return new MyPromise((resolve,reject)=>{
            if(!Array.isArray(promises)) {
               return  reject(new TypeError("arguments must be an array"))
            }
            let result = [];
            let promiseCount = 0;
            let promiseLength = promises.length;
            for(let i = 0; i< promiseLength;i++){
                MyPromise.resolve(promises[i]).then(res=>{
                    promiseCount++
                    result[i] = res
                    if(promiseCount === promiseLength ) {
                        return resolve(result)
                    }
                }).catch(err=>{
                    return reject(err)
                })
            }
        })

    }
    /**
     * @description 只要有一个成功，便返回成功，否则都返回失败，与all处理方式相反
     * @param {*} promises as Array
     */
    static any(promises){
        return new MyPromise((resolve,reject)=>{
            if(!Array.isArray(promises)){
                reject(new TypeError("arguments must be an array"))
            }
            let result = []
            let promiseCount = 0;
            let promiseLength = promises.length
            for(let i =0;i<promiseLength;i++){
                MyPromise.resolve(promises[i]).then(res=>{
                    return resolve(res)
                }).catch(err=>{
                    promiseCount++
                    result[i] = err
                    if(promiseCount === promiseLength) {
                        return resolve({
                            errors:result,
                            message:"All promises were rejected",
                            stack: "AggregateError: All promises were rejected"
                        })
                    }
                })
            }
        })
    }

    /**
     * @description 返回率先执行的promise结果
     * @param {*} promises as Array
     */
    static race(promises) {
        return new MyPromise((resolve,reject)=>{
            for(let i = 0;i< promises.length;i++){
                MyPromise.resolve(promises[i]).then(res=>{
                    return resolve(res)
                }).catch(err=>{
                    return reject(err)
                })
            }
        })
    }
    /**
     * @description 返回执行所有的promise实例的结果。
     * @param {*} promises as Array
     */
    static allSettled(promises){
        return new MyPromise((resolve,reject)=>{
            if(!Array.isArray(promises)) {
                reject(new TypeError("arguments must be an array"))
            }
            let result = [];
            let promiseCount = 0;
            let promiseLength = promises.length;
            for(let i = 0; i< promiseLength; i++) {
                MyPromise.resolve(promises[i]).then(res=>{
                    promiseCount++;
                    result[i] = res
                    if(promiseCount === promiseLength){
                       return resolve(result)
                    }
                }).catch(err => {
                    promiseCount++;
                    result[i] = err
                    if(promiseCount === promiseLength){
                      return reject(result)
                    }
                })
            }
        })
    }

     finally(callBcak){
        return  this.then(
            value => MyPromise.resolve(callBcak()).then(()=>value),
            reason => MyPromise.reject(callBcak()).then(()=>  {throw reason})
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



