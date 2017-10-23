---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
keyword:
    - guid
---
# 通用唯一识别码
随机生成新的通用唯一识别码（UUID, Universally Unique Identifier）。

```html demo doc hide
<button onclick="output.innerHTML = uuid()">生成 UUID</button>
<span id="output"></span>
```

> ##### [!]警告
> 本组件生成的 UUID 有极低的概率会出现相同的情况。

> ##### 另参考
> - [[util/uid]]
> - [Online UUID Generator](https://www.uuidgenerator.net/)