---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 用户唯一标识
随机生成用户唯一标识。

```html demo doc hide
<input type="number" placeholder="输入长度" id="input" value="16">
<button onclick="output.innerHTML = uid(input.value)">生成唯一标识</button>
<span id="output"></span>
```

## 建议
本组件生成的标识有极低的概率会出现相同的情况，仅限用于统计未登陆用户的数据时使用。

如果用户已登陆，则使用其登陆 ID 作为唯一标识。
如果用户未登陆则在首次使用时生成一个唯一标识并保存在 Cookie 或 LocalStorage 中。

如果需要生成绝对唯一的标识，应该由服务端生成并入库，如果下一次生成的唯一标识已在库内则重新生成，以此确保真正的唯一。

> ##### 另参考
> - [[util/uuid]]