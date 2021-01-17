import css from "./index.css";
// import pic from "./logo.png";
// import { str } from "./a.js"; //.js .json
// import "./index.css";
//动态引入 和 代码拆分
console.log(str, "1");


var addCopy = (...args) => {
    // 用作依赖收集
    var _args = args;
    var adder = (...args) => {
      _args.push(...args);
  
      return adder;
    }
    adder.toString = () => {
      return _args.reduce((a, b) => a + b);
    }
    return adder;
  }
  
  const b = addCopy(1)(3)(4)(5)(6);
  console.log(b+10, '22222')
