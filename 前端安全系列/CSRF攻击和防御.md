## CSRF攻击和防御手段

**CSRF：跨站点请求伪造**

> CSRF：(Cross Site Reuqset Forgery),跨站点请求伪造，是一种常见的web攻击，它利用用户已登录的身份，在用户毫不知情的情况下。以用户的名义完成非法的操作。

- 用户已经登录了站点A,并且在本地记录了cookie;
- 在用户没有登出站点A的情况下（也就是cookie生效的情况下），访问了恶意攻击的者提供的引诱危险站点B（B站点要求访问站点A）
- 站点A没有任何的CSRF防御

**CSRF攻击方式**

- GET类型的CSRF

  GET类型的CSRF利用非常简单，只需要一个HTTP请求，一般会这样利用：

  ```js
  <img src="http://bank.example/withdraw?amount=10000&for=hacker" >
  ```

  在受害者访问含有这个img的页面后，浏览器会自动向`http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker`发出一次HTTP请求。bank.example就会收到包含受害者登录信息的一次跨域请求。

- POST类型CSRF

  这种类型的CSRF利用起来通常使用的是一个自动提交的表单，如：

  ```html
  <form action="http://bank.example/withdraw" method=POST>
      <input type="hidden" name="account" value="xiaoming" />
      <input type="hidden" name="amount" value="10000" />
      <input type="hidden" name="for" value="hacker" />
  </form>
  <script> document.forms[0].submit(); </script>
  
  ```

  访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作。

  POST类型的攻击通常比GET要求更加严格一点，但仍并不复杂。任何个人网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能将安全寄托在仅允许POST上面。

- 链接类型CSRF

  链接类型的CSRF并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击，例如

  ```html
  <a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
    重磅消息！！
    <a/>
  ```

  由于之前用户登录了信任的网站A，并且保存登录状态，只要用户主动访问上面的这个PHP页面，则表示攻击成功。

**CSRF防御手段**

CSRF通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性。

CSRF有两个特点：

- CSRF通常发生在第三方域名。
- CSRF攻击者不能获取到Cookie等信息，只是使用。

针对这两点，我可以专门制定防护策略，如下：

- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
- 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重Cookie验证

**相关资料**

# [前端安全系列（二）：如何防止CSRF攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)