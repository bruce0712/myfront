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
        return  new MyPromise((resolve,reject)=>{
            this.then((sucessValue)=>{
                return MyPromise.resolve(callBcak()).then(
                    (r)=>{
                        resolve(sucessValue)
                    }
                )
            },(fieldValue => {
                return MyPromise.reject(callBcak()).then(
                    null,
                    e => {
                        if(e) {
                            reject(e)
                        }else {
                            reject(fieldValue)
                        }
                    }
                )
            }))
        })
    }

}

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
})


const q1 = new MyPromise((resolve, reject) => {
    resolve('hello')
});

const q2 = new MyPromise((resolve, reject) => {
    reject('world')
});
const q3 = new MyPromise((resolve, reject) => {
    resolve('hahaha')
});
MyPromise.allSettled([q1, q2,q3]).then(res => {
    console.log(res); // [ 'hello', 'world' ]
});