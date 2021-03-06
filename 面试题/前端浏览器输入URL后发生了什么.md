## 浏览器输入URL后发生了什么

前端浏览器输入URL后会如下过程：

1.输入地址；

 2.DNS解析；

 3.TCP链接；

 4.发送HTTP请求；

 5.返回HTTP响应；

 6.浏览器解析渲染页面；

 7.断开链接；

 **一、输入地址：**

 当我们在浏览器输入地址的时候，浏览器会根据所输入的url,从历史记录，书签等地方，匹配尽可能全的url地址。

 **二、DNS解析：**

  1.解析过程

  1.查找浏览器缓存：查看浏览器DNS缓存记录，匹配是否有相对应的ip地址，

  2.查找系统缓存：查看本地磁盘host文件有没有域名对应的ip地址，

  3.host文件没有找到，浏览器发送一个DNS请求到本地DNS服务器，

  4.本地DNS服务器判断是否有缓存，没有找到的话，会访问根DNS服务器进行查询，

  5.根DNS服务器向域名服务器发送请求，获取域名解析的服务器地址，

  6.本地DNS服务器向解析的服务器发送请求，获取到域名与ip地址对应的关系，本地DNS服务器把ip地址返回给用户电脑，然后缓存域名与ip地址对应的关系，

 **三、TCP链接：**

 3.1 TCP三次握手

  第一次握手：客户端将标志位SYN 置为1，随机产生一个值seq = j的数据包发送服务器，客户端进入SYN_SENT状态，等待服务器确认；

  第二次握手： 服务器收到数据包后由标志位SYN=1知道客户端请求建立连接，服务器端 SYN=1，ACK=1，ack=j+1，随机产生一个值seq =k，将该数据包发送到客户端，服务端进入 SYN_RCVD状态；

  第三次握手：客户端收到请求后，检查ACK是否为1，ack是否为j+1，如果正确，将标志位ACK= 1，ack= K+1，将该数据包发送给服务器，服务器检查ACK是否为1，ack是否为K+1，如果正确，则完成连接成功，完成三次握手，客户端和服务端完成可以进行数据传输。

完成三次握手的原因是：为了防止已经失效的连接请求报文突然又传到服务器中，而产生错误。

 **四、发送HTTP请求：**

   TCP建立连接后，发送一个http请求。

 **五、返回HTTP响应：**

   服务器接受并处理完成请求，返回HTTP响应，一个响应报文格式基本等同于请求报文，由响应头，响应行，空行，实体组成。

 **六、 浏览器解析渲染页面：**

   浏览器是边解析边渲染的过程。首先浏览器解析HTML文件构建的dom树，然后解析css文件的渲染树，等渲染树构建完成后，浏览器开始布局渲染树并将其绘制到屏幕上。

 **七、断开连接：**

   TCP四次挥手

  第一次挥手：客户端发送一个FIN，用来关闭客户端与服务端的数据传送，客户端进入FIN_WAIT_1状态；

  第二次挥手：服务端收到FIN，发送一个ACK到客户端，确认序号为收到的序号+1，服务端进入CLOSE_WAIT状态；

  第三次挥手：服务端发送一个FIN ，用来关闭客户端与服务端的数据传送，服务端进入LAST_ACK状态；

  第四次挥手：客服端收到FIN，客户端进入TIME_WAIT状态，接着发送一个ACK给服务端，确认序号为收到的序号+1，服务端进入close状态，完成四次挥手。