# 跨域
一个源请求另外一个源的资源时，浏览器会限制访问

一个源是由协议、域名、端口，组成的
协议：http/https
域名：
端口

如果任意一个部分不同都被认为不同的源

## JSONP
原理：script标签的src不受到同源策略的限制。只能使用get请求
后端返回一段js代码，代码内容为一段定义好的函数调用，把实际要返回的数据插入到函数调用里面，前端定义的函数必须是全局唯一的。

缺点：只能发送get请求，不安全，不好维护
优点：兼容性比较好

## 框架自带的跨端能力
vite：
```js
// vite.config.ts
import { defineConfig } from "vite"

export default defineConfig({
    server: {
      proxy: {
        // 只要是/api接口的请求，都会被代理到target
        "/api": {
          target: `http://localhost:3000`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
})
// index.jsx

useEffect(() => {
  const xhr = new XMLHttpRequest();
  // 请求接口的源，与前端启动项目的源保持一致
  xhr.open('GET', 'http://localhost:3004/api');
  xhr.send();
  xhr.onload = (res) => {
    if (xhr.status === 200) {
      console.log('xhr.response', xhr.response)
      setCount(xhr.response);
    }
    console.log('xhr.status', xhr.status)
  }
  
}, []);
```

## cors方案，服务端配合
```js
app.get("/api/sayHello", (req, res) => {  
    // 允许有所的地址跨域  
    res.setHeader("Access-Control-Allow-Origin", "*")  
    // 允许所有的请求方法  
    res.setHeader("Access-Control-Allow-Methods", "*")  
    // 允许携带cookie  
    res.setHeader("Access-Control-Allow-Credentials", "*")  
    // 允许所有的请求头  
    res.setHeader("Access-Control-Allow-Headers", "*")  
    res.send({ name: "hello word" })  
})  
  
app.listen(3000, () => {  
    console.log("service running at 3000 ...")  
})

```

## nginx 代理
正向代理，原理
1、请求转发
nginx拦截到请求，转发给后端接口，服务器，就像收到原请求一样处理

2、添加跨域响应头
Nginx 可以对响应头进行修改，添加允许跨域的相关头部信息。


启动命令
sudo nginx

重启nginx
sudo nginx -s reload

关闭nginx
sudo nginx -s quit

配置文件路径
/usr/local/etc/nginx/nginx.conf





