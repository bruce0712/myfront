console.log("gloab1")
// setImmediate(function(){
//   console.log("Immediate1");
//   process.nextTick(function(){
//     console.log('Immediate1_nextTick');
//   })
//   new Promise(function(resolve){
//     console.log("Immediate1_promise");
//     resolve()
//   }).then(function(){
//     console.log("Immediate1_hten");
//   })
// })
setTimeout(function(){
  console.log("timeout1");
  // process.nextTick(function(){
  //   console.log('timeout1_nextTick');
  // })
  new Promise(function(resolve){
    console.log("timeout1_promise");
    resolve()
  }).then(function(){
    console.log("timeout1_hten");
  })
})



// process.nextTick(function(){
//   console.log('glob1_nextTick');
// })
new Promise(function(resolve){
  console.log("glob1_promise");
  resolve()
}).then(function(){
  console.log("glob1_hten");
})

setTimeout(function(){
  console.log("timeout2");
  // process.nextTick(function(){
  //   console.log('timeout2_nextTick');
  // })
  new Promise(function(resolve){
    console.log("timeout2_promise");
    resolve()
  }).then(function(){
    console.log("timeout2_hten");
  })
})

// process.nextTick(function(){
//   console.log('glob2_nextTick');
// })
new Promise(function(resolve){
  console.log("glob2_promise");
  resolve()
}).then(function(){
  console.log("glob2_hten");
})

// setImmediate(function(){
//   console.log("Immediate2");
//   process.nextTick(function(){
//     console.log('Immediate2_nextTick');
//   })
//   new Promise(function(resolve){
//     console.log("Immediate2_promise");
//     resolve()
//   }).then(function(){
//     console.log("Immediate2_hten");
//   })
// })

const p1 = new Promise((resolve) => {
  resolve()
}).then(function f1() {
  console.log(1)
  const p2 = new Promise(resolve => {
    resolve()
  }).then(function f3() {
    console.log(2)
  }).then(function f4() {
    console.log(4)
  })
}).then(function f2() {
  console.log(3)
})

console.log(0)