## API <small>(源码: [utility/shim/localStorage.js](../../utility/shim/localStorage.js))</small>

| API | 描述 | 示例 |
| `localStorage.getItem` | 获取本地存储数据 | 

<pre>localStorage.getItem("sample"); // 如果不存在则返回 null。</pre>

 |
| `localStorage.setItem` | 设置本地存储数据 | 

<pre>localStorage.setItem("sample", "1")</pre>

 |
| `localStorage.removeItem` | 删除本地存储数据 | 

<pre>localStorage.removeItem("sample")</pre>

 |

> #### 实现原理
> 
> 在不支持本地存储的浏览器，统一使用 Cookie 保存，请确保数据大小。