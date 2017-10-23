---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 异步请求
异步从服务端载入数据。

## 基本用法
```js
import ajax from "web/ajax";

ajax({
    type: "GET",
    url: "",
    data: null,
    success(data) {
        console.log(data);
    }
});
```

## 跨域问题
浏览器默认限制只能向当前网页相同域名的服务器发送请求。

### 跨域头
为了支持跨域请求，服务器响应中应包含：
```
Access-Control-Allow-Origin: *
```

### OPTIONS 请求
如果设置了 `contentType` 为 `application/json`，则浏览器首先会发送一个 OPTIONS 请求。
服务器应处理该请求并返回 200 状态码。

### 登陆信息
只有设置了 `withCredentials` 为 true 时才会发送 Cookie（包含登陆信息）到服务器。
服务器响应中应包含：
```
Access-Control-Allow-Origin: tealui.com         # 值应为实际的域名且不能为 *，其值可以从请求头 Origin 获取。
Access-Control-Allow-Methods: OPTIONS,GET,POST  # 值可以从请求头 Access-Control-Request-Method 获取。
Access-Control-Allow-Headers: contentType       # 值可以从请求头 Access-Control-Request-Headers 获取。
Access-Control-Allow-Credentials: true
```

> ##### 另参考
> - [HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
> - [前端解决跨域问题的 8 种方案](http://www.cnblogs.com/JChen666/p/3399951.html)